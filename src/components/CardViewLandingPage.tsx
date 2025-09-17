import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid,
    FiFilter,
    FiDownload,
    FiArrowRight,
    FiGithub,
    FiChevronRight,
    FiGlobe,
    FiLayout,
    FiBox,
    FiDatabase,
    FiType,
    FiImage,
    FiCheckSquare,
    FiBarChart2,
    FiEdit,
    FiShare,
    FiCode,
    FiSliders,
    FiCpu
} from 'react-icons/fi';
import { Palette, Zap, Sparkles } from "lucide-react";
import './CardViewLanding.css';
import type { Variants } from 'framer-motion'

const CardViewLandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animation variants with proper TypeScript types
    const fadeIn: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const staggerChildren: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const scaleIn: Variants = {
        hidden: { opacity: 0, scale: 0.92 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const slideInLeft: Variants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const slideInRight: Variants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    // Core features - updated to match your library's capabilities
    const coreFeatures = [
        {
            icon: <FiLayout size={28} />,
            title: "Multiple Layouts",
            description: "Grid, masonry, carousel, and stack layouts with responsive breakpoints",
            details: "Choose from 4 different layout types, each with customizable options for spacing, columns, and responsive behavior."
        },
        {
            icon: <FiFilter size={28} />,
            title: "Data Operations",
            description: "Advanced sorting, filtering, and search capabilities",
            details: "Built-in support for complex data manipulation with customizable comparators, filter functions, and search algorithms."
        },
        {
            icon: <FiSliders size={28} />,
            title: "Field Configuration",
            description: "Detailed control over each element's position and appearance",
            details: "Row-based layout system with left/center/right sections for precise UI control."
        },
        {
            icon: <Palette size={28} />,
            title: "Customizable UI",
            description: "Flexible styling options and template-based rendering",
            details: "Complete control over appearance through CSS classes, inline styles, or custom React components for each card element."
        }
    ];

    // Advanced features - updated based on your example
    const advancedFeatures = [
        {
            icon: <FiDownload size={28} />,
            title: "Export Options",
            description: "Download data in various formats with configurable options",
            details: "Export your card data as JSON, CSV, or even generate PNG/SVG snapshots of your card layouts."
        },
        {
            icon: <Zap size={28} />,
            title: "High Performance",
            description: "Virtual scrolling, lazy loading, and optimized rendering",
            details: "Efficient rendering of large datasets through virtualization, lazy loading, and optimized DOM operations."
        },
        {
            icon: <FiDatabase size={28} />,
            title: "Data Management",
            description: "CRUD operations, real-time updates, and state management",
            details: "Complete data management capabilities including add, edit, delete operations with seamless state synchronization."
        },
        {
            icon: <FiCpu size={28} />,
            title: "Programmatic Control",
            description: "Full API access for dynamic configuration changes",
            details: "Update pagination, show/hide loaders, and modify configurations programmatically with exposed methods."
        }
    ];

    // Content type features
    const contentTypeFeatures = [
        {
            icon: <FiCode size={28} />,
            title: "Template System",
            description: "Handlebars-style syntax for custom HTML templates",
            details: "Create custom card layouts using template strings with dynamic data binding and helper functions."
        },
        {
            icon: <FiType size={28} />,
            title: "Editable Fields",
            description: "In-place editing with validation for various field types",
            details: "Support for text, select, radio, number, date, and file inputs with comprehensive validation rules."
        },
        {
            icon: <FiImage size={28} />,
            title: "Media Support",
            description: "Images, avatars, and rich media content",
            details: "Seamless integration of images, avatars, and other media with lazy loading and optimized performance."
        },
        {
            icon: <FiBarChart2 size={28} />,
            title: "Data Visualization",
            description: "Charts, ratings, and status indicators",
            details: "Built-in support for data visualization components that can be embedded directly within cards."
        }
    ];

    // Stats - updated to reflect your library's features
    const stats = [
        { value: "4", label: "Layout Types" },
        { value: "100%", label: "Customizable" },
        // { value: "10+", label: "Field Types" },
        { value: "TypeScript", label: "Fully Typed" },
        // { value: "Material-UI", label: "Integration" },
        { value: "∞", label: "Use Cases" }
    ];

    // Navigation items
    const navItems = [
        { name: 'Features', path: '#features' },
        { name: 'Examples', path: '#examples' },
        { name: 'Docs', path: '#docs' },
        { name: 'API', path: '#api' }
    ];

    // Use cases - updated based on your example
    const useCases = [
        {
            title: "Employee Directories",
            description: "Manage team members with detailed profiles and contact information",
            icon: <FiBox size={24} />
        },
        {
            title: "Dashboard Analytics",
            description: "Display data cards with interactive charts and metrics",
            icon: <FiBarChart2 size={24} />
        },
        {
            title: "Content Management",
            description: "Manage articles, media, and content in an intuitive card interface",
            icon: <FiEdit size={24} />
        },
        {
            title: "E-Commerce Products",
            description: "Showcase products with filtering, sorting, and quick views",
            icon: <FiShare size={24} />
        },
        {
            title: "User Profiles",
            description: "Display user information with avatars and status indicators",
            icon: <FiImage size={24} />
        },
        {
            title: "Task Management",
            description: "Organize tasks and projects in flexible card-based systems",
            icon: <FiCheckSquare size={24} />
        }
    ];

    // Code examples - updated to match your library's API
    const codeExamples = [
        {
            title: "Basic Configuration",
            code: `const config = {
  data: employees,
  layout: {
    type: 'grid',
    columns: 3,
    gap: '20px'
  },
  content: {
    contentDisplayType: 'default-view'
  }
};`
        },
        {
            title: "Field Configuration",
            code: `content: {
  contentDisplayType: 'field-config',
  content: {
    rows: [
      {
        id: 'header-row',
        left: { elements: [{ 
          id: 'avatar', 
          field: 'avatar',
          component: (value) => <Avatar src={value} />
        }]},
        center: { elements: [{ 
          id: 'name', 
          field: 'name',
          component: (value) => <Typography>{value}</Typography>
        }]}
      }
    ]
  }
}`
        },
        {
            title: "Template System",
            code: `content: {
  contentDisplayType: 'template-config',
  content: {
    template: \`
      <div class="card">
        <h3>{{name}}</h3>
        <p>{{role}} - {{department}}</p>
        <span>Rating: {{rating}}</span>
      </div>
    \`
  }
}`
        }
    ];

    return (
        <div className="card-view-landing">
            {/* Header */}
            <header className={`card-view-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="card-view-container">
                    <nav className="card-view-nav">
                        <a href="#" className="card-view-logo">
                            <div className="card-view-logo-icon">
                                <FiGrid size={20} />
                            </div>
                            <span className="card-view-logo-text">React CardView</span>
                        </a>

                        <div className="card-view-nav-items">
                            {navItems.map((item) => (
                                <a key={item.name} href={item.path} className="card-view-nav-link">
                                    {item.name}
                                </a>
                            ))}
                        </div>

                        <div className="card-view-nav-actions">
                            <a href="https://github.com" className="card-view-btn card-view-btn-secondary">
                                <FiGithub size={18} className="mr-2" />
                                GitHub
                            </a>
                            <button className="card-view-btn card-view-btn-primary">
                                Get Started <FiChevronRight size={16} className="ml-1" />
                            </button>

                            <button
                                className="card-view-mobile-menu-btn"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? '✕' : '☰'}
                            </button>
                        </div>
                    </nav>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="card-view-mobile-menu"
                        >
                            <div className="card-view-container">
                                <div className="card-view-mobile-menu-items">
                                    {navItems.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.path}
                                            className="card-view-mobile-menu-link"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                    <a
                                        href="https://github.com"
                                        className="card-view-mobile-menu-link"
                                    >
                                        <FiGithub size={18} className="mr-2" />
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Section */}
            <section className="card-view-hero">
                <div className="card-view-container">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerChildren}
                    >
                        <motion.div variants={fadeIn} className="card-view-badge gap-2">
                            <Sparkles size={16} className="mr-2" />
                            Advanced React Card Component Library
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="card-view-hero-title">
                            Build Powerful, Flexible <span>Card UIs</span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="card-view-hero-description">
                            A highly customizable React component library for creating sophisticated card-based interfaces with advanced features like sorting, filtering, templates, and field configuration.
                        </motion.p>

                        <motion.div variants={fadeIn} className="card-view-hero-actions">
                            <button className="card-view-btn card-view-btn-primary card-view-hero-btn">
                                Get Started <FiArrowRight size={20} className="ml-2" />
                            </button>
                            <button className="card-view-btn card-view-btn-secondary card-view-hero-btn gap-2" >
                                <FiGithub size={20} className="mr-2" />
                                View Examples
                            </button>
                        </motion.div>

                        <motion.div
                            variants={fadeIn}
                            className="card-view-hero-demo"
                        >
                            <div className="card-view-demo-header">
                                <div className="card-view-demo-dot card-view-demo-dot-red"></div>
                                <div className="card-view-demo-dot card-view-demo-dot-yellow"></div>
                                <div className="card-view-demo-dot card-view-demo-dot-green"></div>
                                <span className="card-view-demo-title">Employee Directory Demo</span>
                            </div>
                            <div className="card-view-demo-grid">
                                {[1, 2, 3].map((item) => (
                                    <motion.div
                                        key={item}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                        className="card-view-demo-card"
                                    >
                                        <div className="card-view-demo-card-image">
                                            <div className="card-view-demo-card-image-content">
                                                <div className="demo-avatar"></div>
                                                <span>Employee {item}</span>
                                            </div>
                                        </div>
                                        <div className="card-view-demo-card-content">
                                            <div className="card-view-demo-card-line"></div>
                                            <div className="card-view-demo-card-line card-view-demo-card-line-short"></div>
                                            <div className="card-view-demo-card-line card-view-demo-card-line-medium"></div>
                                        </div>
                                        <div className="card-view-demo-card-actions">
                                            <div className="demo-action-button"></div>
                                            <div className="demo-action-button"></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="card-view-stats">
                <div className="card-view-container">
                    <div className="card-view-stats-grid">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="card-view-stat-item"
                            >
                                <div className="card-view-stat-value">{stat.value}</div>
                                <div className="card-view-stat-label">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="card-view-features">
                <div className="card-view-container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerChildren}
                    >
                        <motion.div variants={fadeIn} className="card-view-section-header">
                            <h2 className="card-view-section-title">Comprehensive Features</h2>
                            <p className="card-view-section-description">
                                Everything you need to create sophisticated card-based interfaces with complete control over layout and functionality.
                            </p>
                        </motion.div>

                        <div className="card-view-features-tabs">
                            <div className="card-view-features-tablist">
                                <button
                                    className={`card-view-features-tab  gap-2 ${activeFeature === 0 ? 'active' : ''}`}
                                    onClick={() => setActiveFeature(0)}
                                >
                                    <FiLayout className="mr-2" />
                                    Core Features
                                </button>
                                <button
                                    className={`card-view-features-tab  gap-2 ${activeFeature === 1 ? 'active' : ''}`}
                                    onClick={() => setActiveFeature(1)}
                                >
                                    <Zap className="mr-2" size={16} />
                                    Advanced Features
                                </button>
                                <button
                                    className={`card-view-features-tab gap-2  ${activeFeature === 2 ? 'active' : ''}`}
                                    onClick={() => setActiveFeature(2)}
                                >
                                    <FiCode className="mr-2" />
                                    Content Types
                                </button>
                            </div>

                            <div className="card-view-features-tabcontent">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`feature-panel-${activeFeature}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="card-view-features-tabpanel"
                                    >
                                        <div className="card-view-features-grid">
                                            {(activeFeature === 0
                                                ? coreFeatures
                                                : activeFeature === 1
                                                    ? advancedFeatures
                                                    : contentTypeFeatures
                                            ).map((feature, index) => (
                                                <motion.div
                                                    key={`${activeFeature}-${index}`} // 👈 ensure unique key per tab
                                                    variants={scaleIn}
                                                    initial="hidden"
                                                    animate="visible"
                                                    whileHover={{ y: -8 }}
                                                    className="card-view-feature-card"
                                                >
                                                    <div className="card-view-feature-icon">{feature.icon}</div>
                                                    <h3 className="card-view-feature-title">{feature.title}</h3>
                                                    <p className="card-view-feature-description">{feature.description}</p>
                                                    <p className="card-view-feature-details">{feature.details}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>

                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section id="examples" className="card-view-use-cases">
                <div className="card-view-container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerChildren}
                    >
                        <motion.div variants={fadeIn} className="card-view-section-header">
                            <h2 className="card-view-section-title">Real-World Applications</h2>
                            <p className="card-view-section-description">
                                Discover how React CardView can transform your applications across various domains and use cases.
                            </p>
                        </motion.div>

                        <div className="card-view-use-cases-grid">
                            {useCases.map((useCase, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeIn}
                                    whileHover={{ y: -5 }}
                                    className="card-view-use-case-card"
                                >
                                    <div className="card-view-use-case-icon">{useCase.icon}</div>
                                    <h3 className="card-view-use-case-title">{useCase.title}</h3>
                                    <p className="card-view-use-case-description">{useCase.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Code Examples Section */}
            <section id="api" className="card-view-code-examples">
                <div className="card-view-container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerChildren}
                    >
                        <motion.div variants={fadeIn} className="card-view-section-header">
                            <h2 className="card-view-section-title">Flexible API</h2>
                            <p className="card-view-section-description">
                                Get started quickly with simple, intuitive APIs and comprehensive configuration options.
                            </p>
                        </motion.div>

                        <div className="card-view-code-examples-grid">
                            {codeExamples.map((example, index) => (
                                <motion.div
                                    key={index}
                                    variants={index % 2 === 0 ? slideInLeft : slideInRight}
                                    className="card-view-code-example"
                                >
                                    <h3 className="card-view-code-example-title">{example.title}</h3>
                                    <div className="card-view-code-example-content">
                                        <pre>
                                            <code>{example.code}</code>
                                        </pre>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="card-view-cta">
                <div className="card-view-container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerChildren}
                    >
                        <motion.h2 variants={fadeIn} className="card-view-cta-title">
                            Ready to Build Amazing Card UIs?
                        </motion.h2>
                        <motion.p variants={fadeIn} className="card-view-cta-description">
                            Start creating beautiful, interactive card views in minutes with our comprehensive React library.
                        </motion.p>
                        <motion.div variants={fadeIn} className="card-view-cta-actions">
                            <button className="card-view-btn card-view-cta-btn card-view-cta-btn-primary">
                                Get Started
                            </button>
                            <button className="card-view-btn card-view-cta-btn card-view-cta-btn-secondary">
                                View Documentation
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="card-view-footer">
                <div className="card-view-container">
                    <div className="card-view-footer-grid">
                        <div className="card-view-footer-brand">
                            <div className="card-view-footer-logo">
                                <div className="card-view-footer-logo-icon">
                                    <FiGrid size={20} />
                                </div>
                                <span className="card-view-footer-logo-text">React CardView</span>
                            </div>
                            <p className="card-view-footer-description">
                                A modern React library for building beautiful, flexible card interfaces.
                            </p>
                            <div className="card-view-footer-social">
                                <a href="#" className="card-view-footer-social-link">
                                    <FiGithub size={20} />
                                </a>
                                <a href="#" className="card-view-footer-social-link">
                                    <FiGlobe size={20} />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="card-view-footer-heading">Resources</h3>
                            <div className="card-view-footer-links">
                                <a href="#" className="card-view-footer-link">Documentation</a>
                                <a href="#" className="card-view-footer-link">Examples</a>
                                <a href="#" className="card-view-footer-link">Tutorials</a>
                                <a href="#" className="card-view-footer-link">API Reference</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="card-view-footer-heading">Community</h3>
                            <div className="card-view-footer-links">
                                <a href="#" className="card-view-footer-link">GitHub</a>
                                <a href="#" className="card-view-footer-link">Discord</a>
                                <a href="#" className="card-view-footer-link">Twitter</a>
                                <a href="#" className="card-view-footer-link">Blog</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="card-view-footer-heading">Company</h3>
                            <div className="card-view-footer-links">
                                <a href="#" className="card-view-footer-link">About</a>
                                <a href="#" className="card-view-footer-link">Careers</a>
                                <a href="#" className="card-view-footer-link">Contact</a>
                                <a href="#" className="card-view-footer-link">Privacy</a>
                            </div>
                        </div>
                    </div>

                    <div className="card-view-footer-bottom">
                        <p>© {new Date().getFullYear()} React CardView Library. MIT Licensed.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CardViewLandingPage;