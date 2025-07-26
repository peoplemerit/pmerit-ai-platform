const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Cultural Intelligence Router
class CulturalIntelligenceRouter {
    constructor() {
        this.culturalContexts = {
            nigeria_launch: {
                languages: ['en', 'yo', 'ha', 'ig'],
                curriculum_focus: 'remote_career_with_local_context',
                payment_methods: ['bank_transfer', 'mobile_money'],
                cultural_examples: true
            },
            global_template: {
                languages: ['configurable'],
                curriculum_focus: 'adaptive_regional',
                payment_methods: ['configurable'],
                cultural_examples: 'regional_adaptive'
            }
        };
        this.currentContext = process.env.DEFAULT_CULTURAL_CONTEXT || 'nigeria_launch';
    }

    routeRequest(req, res, next) {
        // Add cultural context to request
        req.culturalContext = this.culturalContexts[this.currentContext];
        req.isGlobalExpansionReady = process.env.GLOBAL_EXPANSION_READY === 'true';
        next();
    }

    adaptContent(content, targetRegion = null) {
        const context = targetRegion ? 
            this.culturalContexts[targetRegion] || this.culturalContexts.global_template :
            this.culturalContexts[this.currentContext];
        
        return {
            ...content,
            cultural_adaptation: context,
            expansion_ready: true
        };
    }
}

const culturalRouter = new CulturalIntelligenceRouter();
app.use(culturalRouter.routeRequest.bind(culturalRouter));

// Routes
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'gabriel-core',
        port: PORT,
        cultural_context: req.culturalContext,
        global_expansion_ready: req.isGlobalExpansionReady,
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    const welcomeContent = culturalRouter.adaptContent({
        message: 'Gabriel AI Educational Platform - Contextually Intelligent',
        mission: 'Breaking poverty cycles through accessible education',
        scope: 'Global underserved communities',
        launch_region: 'Nigeria (expandable to all regions)'
    });
    
    res.json(welcomeContent);
});

// API Gateway - Route to other services
app.use('/api/users', (req, res) => {
    res.json({ message: 'User service routing (Port 8001)', status: 'ready' });
});

app.use('/api/courses', (req, res) => {
    res.json({ message: 'Course service routing (Port 8002)', status: 'ready' });
});

app.use('/api/virtual-human', (req, res) => {
    res.json({ message: 'Virtual Human service routing (Port 8003)', status: 'ready' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌍 Gabriel AI Core running on port ${PORT}`);
    console.log(`🌐 Cultural Intelligence: Configurable (Launch: ${process.env.DEFAULT_CULTURAL_CONTEXT})`);
    console.log(`🎯 Mission: Breaking poverty cycles through accessible education - Global Scale`);
    console.log(`🚀 Global Expansion Ready: ${process.env.GLOBAL_EXPANSION_READY}`);
});
