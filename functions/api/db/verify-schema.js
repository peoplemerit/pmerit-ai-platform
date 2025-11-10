/**
 * Schema Verification Module
 * Uses Drizzle ORM with Node.js compatibility enabled
 * 
 * @version 5.0.0
 * @updated November 10, 2025 - Drizzle ORM with node_compat=true
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';

const EXPECTED_SCHEMA = {
  assessment_sessions: {
    columns: {
      id: { type: 'integer', nullable: false },
      session_id: { type: 'uuid', nullable: false },
      user_id: { type: 'integer', nullable: true },
      consent_data: { type: 'jsonb', nullable: false },
      current_question: { type: 'integer', nullable: false },
      answers: { type: 'jsonb', nullable: true },
      status: { type: 'character varying', nullable: false },
      started_at: { type: 'timestamp with time zone', nullable: false },
      updated_at: { type: 'timestamp with time zone', nullable: false },
      created_at: { type: 'timestamp with time zone', nullable: false }
    },
    primaryKey: 'id',
    foreignKeys: { user_id: { table: 'users', column: 'id' } },
    indexes: [
      'idx_assessment_sessions_session_id',
      'idx_assessment_sessions_user_id',
      'idx_assessment_sessions_status_created',
      'idx_assessment_sessions_updated_at'
    ]
  },
  assessment_results: {
    columns: {
      id: { type: 'integer', nullable: false },
      result_id: { type: 'uuid', nullable: false },
      session_id: { type: 'uuid', nullable: false },
      user_id: { type: 'integer', nullable: true },
      big_five: { type: 'jsonb', nullable: false },
      holland_code: { type: 'character varying', nullable: false },
      career_matches: { type: 'jsonb', nullable: false },
      completed_at: { type: 'timestamp with time zone', nullable: false },
      created_at: { type: 'timestamp with time zone', nullable: false }
    },
    primaryKey: 'id',
    foreignKeys: {
      session_id: { table: 'assessment_sessions', column: 'session_id' },
      user_id: { table: 'users', column: 'id' }
    },
    indexes: [
      'idx_assessment_results_result_id',
      'idx_assessment_results_session_id',
      'idx_assessment_results_user_id',
      'idx_assessment_results_holland_code'
    ]
  }
};

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
    const databaseUrl = env.DATABASE_URL || env.NEON_CONNECTION_STRING;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not configured');
    }

    // Initialize Drizzle with Neon serverless
    const sqlClient = neon(databaseUrl);
    const db = drizzle(sqlClient);

    for (const [tableName, expectedDef] of Object.entries(EXPECTED_SCHEMA)) {
      results.details.summary.tablesChecked++;
      
      const tableResult = {
        exists: false,
        columns: { valid: [], missing: [], typeMismatch: [] },
        indexes: { valid: [], missing: [] },
        foreignKeys: { valid: [], missing: [] },
        primaryKey: { valid: false, expected: expectedDef.primaryKey }
      };

      // Check if table exists
      const tableCheck = await db.execute(sql`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = ${tableName}
      `);

      if (!tableCheck.rows || tableCheck.rows.length === 0) {
        tableResult.exists = false;
        results.success = false;
        results.details.tables[tableName] = tableResult;
        continue;
      }

      tableResult.exists = true;

      // Check columns
      const columns = await db.execute(sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${tableName}
        ORDER BY ordinal_position
      `);

      const actualColumns = {};
      for (const col of columns.rows || []) {
        actualColumns[col.column_name] = {
          type: col.data_type.toLowerCase(),
          nullable: col.is_nullable === 'YES'
        };
      }

      for (const [colName, expectedCol] of Object.entries(expectedDef.columns)) {
        if (!actualColumns[colName]) {
          tableResult.columns.missing.push(colName);
          results.details.summary.columnsMissing.push(`${tableName}.${colName}`);
          results.success = false;
        } else {
          const actualType = actualColumns[colName].type.replace(/\s+/g, ' ');
          const expectedType = expectedCol.type.replace(/\s+/g, ' ');
          
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

      // Check primary key
      const primaryKey = await db.execute(sql`
        SELECT a.attname as column_name
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = ${tableName}::regclass AND i.indisprimary
      `);

      if (primaryKey.rows && primaryKey.rows.length > 0 && 
          primaryKey.rows[0].column_name === expectedDef.primaryKey) {
        tableResult.primaryKey.valid = true;
      } else {
        results.success = false;
      }

      // Check indexes
      const indexes = await db.execute(sql`
        SELECT indexname FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = ${tableName}
      `);

      const actualIndexes = (indexes.rows || []).map(idx => idx.indexname);

      for (const expectedIdx of expectedDef.indexes) {
        if (actualIndexes.includes(expectedIdx)) {
          tableResult.indexes.valid.push(expectedIdx);
        } else {
          tableResult.indexes.missing.push(expectedIdx);
          results.details.summary.indexesMissing.push(`${tableName}.${expectedIdx}`);
          results.success = false;
        }
      }

      // Check foreign keys
      const foreignKeys = await db.execute(sql`
        SELECT kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = ${tableName}
      `);

      const actualForeignKeys = {};
      for (const fk of foreignKeys.rows || []) {
        actualForeignKeys[fk.column_name] = {
          table: fk.foreign_table_name,
          column: fk.foreign_column_name
        };
      }

      for (const [colName, expectedFK] of Object.entries(expectedDef.foreignKeys || {})) {
        if (!actualForeignKeys[colName]) {
          tableResult.foreignKeys.missing.push(colName);
          results.details.summary.foreignKeysMissing.push(
            `${tableName}.${colName} -> ${expectedFK.table}.${expectedFK.column}`
          );
          results.success = false;
        } else if (actualForeignKeys[colName].table === expectedFK.table && 
                   actualForeignKeys[colName].column === expectedFK.column) {
          tableResult.foreignKeys.valid.push(colName);
        } else {
          results.success = false;
        }
      }

      if (tableResult.columns.missing.length === 0 && 
          tableResult.columns.typeMismatch.length === 0 && 
          tableResult.indexes.missing.length === 0 && 
          tableResult.foreignKeys.missing.length === 0 && 
          tableResult.primaryKey.valid) {
        results.details.summary.tablesValid++;
      }

      results.details.tables[tableName] = tableResult;
    }

    return results;

  } catch (error) {
    console.error('[verifySchema] Error:', error);
    return {
      success: false,
      details: { error: error.message, stack: error.stack }
    };
  }
}

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
  }
  
  report += '\n=== End Report ===\n';
  return report;
}

export default verifySchema;