/**
 * Schema Verification Module
 * Verifies that assessment_sessions and assessment_results tables exist
 * with correct columns, constraints, and indexes
 * 
 * @module verify-schema
 * @requires Hyperdrive connection (Neon PostgreSQL)
 * @version 1.0.0
 * @created November 3, 2025
 * @issue #18 - Database Integration & Schema Verification
 */

/**
 * Expected schema definition for validation
 */

export async function verifySchema(env) {
  const results = {
    success: true,
    details: {
      tables: {},
      summary: {
        tablesChecked: 0,
        tablesValid: 0,
        columnsMissing: [],
        indexesMissing: [],
        foreignKeysMissing: []
      }
    }
  };

  try {
    // Check each expected table
    for (const [tableName, expectedDef] of Object.entries(EXPECTED_SCHEMA)) {
      results.details.summary.tablesChecked++;
      
      const tableResult = {
        exists: false,
        columns: { valid: [], missing: [], typeMismatch: [] },
        indexes: { valid: [], missing: [] },
        foreignKeys: { valid: [], missing: [] },
        primaryKey: { valid: false, expected: expectedDef.primaryKey }
      };

      // 1. Check if table exists
      const tableCheck = await queryFirst(env, `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = $1
      `, [tableName]);

      if (!tableCheck) {
        tableResult.exists = false;
        results.success = false;
        results.details.tables[tableName] = tableResult;
        continue;
      }

      tableResult.exists = true;

      // 2. Check columns and data types
      const columns = await queryAll(env, `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);

      const actualColumns = {};
      for (const col of columns || []) {
        actualColumns[col.column_name] = {
          type: col.data_type.toLowerCase(),
          nullable: col.is_nullable === 'YES'
        };
      }

      // Validate each expected column
      for (const [colName, expectedCol] of Object.entries(expectedDef.columns)) {
        if (!actualColumns[colName]) {
          tableResult.columns.missing.push(colName);
          results.details.summary.columnsMissing.push(`${tableName}.${colName}`);
          results.success = false;
        } else {
          // Normalize type names for comparison
          const actualType = actualColumns[colName].type.replace(/\s+/g, ' ');
          const expectedType = expectedCol.type.replace(/\s+/g, ' ');
          
          // Check if types match (allowing for some variations)
          const typeMatch = actualType === expectedType || 
                          actualType.includes(expectedType) ||
                          expectedType.includes(actualType);
          
          if (!typeMatch) {
            tableResult.columns.typeMismatch.push({
              column: colName,
              expected: expectedType,
              actual: actualType
            });
            results.success = false;
          } else {
            tableResult.columns.valid.push(colName);
          }
        }
      }

      // 3. Check primary key
      const primaryKey = await queryFirst(env, `
        SELECT a.attname as column_name
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = $1::regclass AND i.indisprimary
      `, [tableName]);

      if (primaryKey && primaryKey.column_name === expectedDef.primaryKey) {
        tableResult.primaryKey.valid = true;
      } else {
        tableResult.primaryKey.valid = false;
        results.success = false;
      }

      // 4. Check indexes
      const indexes = await queryAll(env, `
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = $1
      `, [tableName]);

      const actualIndexes = (indexes || []).map(idx => idx.indexname);

      for (const expectedIdx of expectedDef.indexes) {
        if (actualIndexes.includes(expectedIdx)) {
          tableResult.indexes.valid.push(expectedIdx);
        } else {
          tableResult.indexes.missing.push(expectedIdx);
          results.details.summary.indexesMissing.push(`${tableName}.${expectedIdx}`);
          results.success = false;
        }
      }

      // 5. Check foreign keys
      const foreignKeys = await queryAll(env, `
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = $1
      `, [tableName]);

      const actualForeignKeys = {};
      for (const fk of foreignKeys || []) {
        actualForeignKeys[fk.column_name] = {
          table: fk.foreign_table_name,
          column: fk.foreign_column_name
        };
      }

      // Validate foreign keys
      for (const [colName, expectedFK] of Object.entries(expectedDef.foreignKeys || {})) {
        if (!actualForeignKeys[colName]) {
          tableResult.foreignKeys.missing.push(colName);
          results.details.summary.foreignKeysMissing.push(
            `${tableName}.${colName} -> ${expectedFK.table}.${expectedFK.column}`
          );
          results.success = false;
        } else if (
          actualForeignKeys[colName].table === expectedFK.table &&
          actualForeignKeys[colName].column === expectedFK.column
        ) {
          tableResult.foreignKeys.valid.push(colName);
        } else {
          tableResult.foreignKeys.missing.push(colName);
          results.success = false;
        }
      }

      // Update summary
      if (
        tableResult.columns.missing.length === 0 &&
        tableResult.columns.typeMismatch.length === 0 &&
        tableResult.indexes.missing.length === 0 &&
        tableResult.foreignKeys.missing.length === 0 &&
        tableResult.primaryKey.valid
      ) {
        results.details.summary.tablesValid++;
      }

      results.details.tables[tableName] = tableResult;
    }

    return results;

  } catch (error) {
    console.error('[verifySchema] Error during verification:', error);
    return {
      success: false,
      details: {
        error: error.message,
        stack: error.stack
      }
    };
  }
}

/**
 * Generate a human-readable verification report
 * @param {Object} verificationResult - Result from verifySchema()
 * @returns {string} Formatted report
 */
export function generateReport(verificationResult) {
  const { success, details } = verificationResult;
  
  let report = '\n=== Schema Verification Report ===\n\n';
  
  if (success) {
    report += '✅ Schema verification PASSED\n';
    report += `All ${details.summary.tablesChecked} tables are correctly configured.\n`;
  } else {
    report += '❌ Schema verification FAILED\n\n';
    
    if (details.error) {
      report += `Error: ${details.error}\n`;
      return report;
    }
    
    report += `Tables checked: ${details.summary.tablesChecked}\n`;
    report += `Tables valid: ${details.summary.tablesValid}\n\n`;
    
    if (details.summary.columnsMissing.length > 0) {
      report += 'Missing columns:\n';
      details.summary.columnsMissing.forEach(col => {
        report += `  - ${col}\n`;
      });
      report += '\n';
    }
    
    if (details.summary.indexesMissing.length > 0) {
      report += 'Missing indexes:\n';
      details.summary.indexesMissing.forEach(idx => {
        report += `  - ${idx}\n`;
      });
      report += '\n';
    }
    
    if (details.summary.foreignKeysMissing.length > 0) {
      report += 'Missing foreign keys:\n';
      details.summary.foreignKeysMissing.forEach(fk => {
        report += `  - ${fk}\n`;
      });
      report += '\n';
    }
    
    // Detailed table info
    report += 'Detailed Results:\n';
    for (const [tableName, tableResult] of Object.entries(details.tables)) {
      report += `\n${tableName}:\n`;
      report += `  Exists: ${tableResult.exists ? '✅' : '❌'}\n`;
      
      if (tableResult.exists) {
        report += `  Valid columns: ${tableResult.columns.valid.length}\n`;
        report += `  Missing columns: ${tableResult.columns.missing.length}\n`;
        report += `  Type mismatches: ${tableResult.columns.typeMismatch.length}\n`;
        report += `  Valid indexes: ${tableResult.indexes.valid.length}\n`;
        report += `  Missing indexes: ${tableResult.indexes.missing.length}\n`;
        report += `  Valid foreign keys: ${tableResult.foreignKeys.valid.length}\n`;
        report += `  Missing foreign keys: ${tableResult.foreignKeys.missing.length}\n`;
        report += `  Primary key: ${tableResult.primaryKey.valid ? '✅' : '❌'}\n`;
      }
    }
  }
  
  report += '\n=== End Report ===\n';
  return report;
}

// Export for use in Cloudflare Workers
export default verifySchema;