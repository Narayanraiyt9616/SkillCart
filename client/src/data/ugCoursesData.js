// Comprehensive Undergraduate Course Tracks, Specializations & Skills Data
// Normalized with explicit unique IDs and Slugs for 100% Reliable Data Flow

export const UG_STREAMS = [
  { id: 'all', name: 'All Degrees' },
  { id: 'tech', name: 'Engineering & IT' },
  { id: 'commerce', name: 'Commerce & Management' },
  { id: 'science', name: 'Sciences & Healthcare' },
  { id: 'design', name: 'Design & Arts' },
  { id: 'law', name: 'Law & Hospitality' },
];

export const UG_COURSES = [
  {
    id: 'btech',
    slug: 'btech',
    title: 'B.Tech',
    fullName: 'Bachelor of Technology',
    stream: 'tech',
    badge: 'Engineering & Technology',
    icon: 'Cpu',
    gradient: 'from-blue-600 to-indigo-600',
    lightBg: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-400',
    description: 'Premier 4-year technical degree focusing on core engineering principles, computing architectures, automation, and emerging technologies.',
    topFields: ['Computer Science & Engineering', 'Artificial Intelligence & ML', 'Cyber Security', 'Data Science'],
    specializations: [
      {
        id: 'cse',
        name: 'Computer Science & Engineering',
        description: 'Software development, system design, algorithm analysis, and computing infrastructure.',
        skills: [
          { id: 'web-development', slug: 'web-development', name: 'Web Development', certificationTitle: 'Web Development Certification', desc: 'Frontend, Backend, React, Node.js, and Full Stack Architecture' },
          { id: 'data-structures-algorithms', slug: 'data-structures-algorithms', name: 'Data Structures & Algorithms', certificationTitle: 'Data Structures & Algorithms Certification', desc: 'Arrays, Trees, Graphs, Sorting, and Algorithmic Complexity' },
          { id: 'operating-systems', slug: 'operating-systems', name: 'Operating Systems', certificationTitle: 'Operating Systems Engineering Certification', desc: 'Kernel Architecture, Process Scheduling, Threads, and Memory Management' },
          { id: 'computer-networks', slug: 'computer-networks', name: 'Computer Networks', certificationTitle: 'Computer Networks & Security Certification', desc: 'TCP/IP Model, Routing Protocols, Sockets, and Network Architecture' },
          { id: 'database-management-systems', slug: 'database-management-systems', name: 'Database Management Systems', certificationTitle: 'Database Systems & SQL Certification', desc: 'SQL Relational Modeling, Indexing, Transactions, and NoSQL' },
          { id: 'software-engineering', slug: 'software-engineering', name: 'Software Engineering', certificationTitle: 'Software Engineering Architecture Certification', desc: 'SDLC, Agile Methodology, System Design, and Clean Architecture' },
          { id: 'devops-ci-cd', slug: 'devops-ci-cd', name: 'DevOps & CI/CD', certificationTitle: 'DevOps & Cloud Automation Certification', desc: 'Containerization (Docker), Kubernetes, Pipeline Automation, and Infrastructure' },
          { id: 'mobile-app-development', slug: 'mobile-app-development', name: 'Mobile App Development', certificationTitle: 'Mobile Application Engineering Certification', desc: 'React Native, Flutter, Android Studio, and iOS Development' },
          { id: 'cloud-computing', slug: 'cloud-computing', name: 'Cloud Computing', certificationTitle: 'Cloud Infrastructure & Architecture Certification', desc: 'AWS, Azure, Cloud Architecture, Microservices, and Serverless' },
        ],
      },
      {
        id: 'aiml',
        name: 'Artificial Intelligence & Machine Learning',
        description: 'Intelligent systems, deep neural networks, computer vision, and natural language processing.',
        skills: [
          { id: 'ai-machine-learning', slug: 'ai-machine-learning', name: 'Artificial Intelligence & Machine Learning', certificationTitle: 'AI & Machine Learning Specialist Certification', desc: 'Supervised, Unsupervised, Regression, Classification, and Scikit-Learn' },
          { id: 'deep-learning-neural-networks', slug: 'deep-learning-neural-networks', name: 'Deep Learning & Neural Networks', certificationTitle: 'Deep Learning & Neural Networks Certification', desc: 'TensorFlow, PyTorch, Convolutional Neural Networks, and Recurrent Neural Networks' },
          { id: 'data-science-big-data', slug: 'data-science-big-data', name: 'Data Science & Big Data', certificationTitle: 'Data Science & Big Data Analytics Certification', desc: 'Data Analytics, Pandas, NumPy, Data Visualization, and Feature Engineering' },
          { id: 'natural-language-processing', slug: 'natural-language-processing', name: 'Natural Language Processing', certificationTitle: 'NLP & Language Models Certification', desc: 'Text Processing, Transformers, LLMs, Sentiment Analysis, and Tokenization' },
          { id: 'computer-vision', slug: 'computer-vision', name: 'Computer Vision', certificationTitle: 'Computer Vision & Image Processing Certification', desc: 'OpenCV, Image Processing, Object Detection, and Spatial Recognition' },
        ],
      },
      {
        id: 'cybersec',
        name: 'Cyber Security & Network Defense',
        description: 'Information assurance, penetration testing, threat analysis, and cryptographic defenses.',
        skills: [
          { id: 'cyber-security-ethical-hacking', slug: 'cyber-security-ethical-hacking', name: 'Cyber Security & Ethical Hacking', certificationTitle: 'Cyber Security & Ethical Hacking Certification', desc: 'Vulnerability Assessment, OWASP Top 10, Penetration Testing, and Defense' },
          { id: 'network-security', slug: 'network-security', name: 'Network Security', certificationTitle: 'Network Defense & Infrastructure Security Certification', desc: 'Firewalls, IDS/IPS, TLS/SSL, Protocol Analysis, and VPN Architecture' },
          { id: 'cryptography', slug: 'cryptography', name: 'Cryptography', certificationTitle: 'Cryptography & Data Protection Certification', desc: 'Symmetric & Asymmetric Ciphers, Hashing, RSA, AES, and PKI Infrastructure' },
          { id: 'cloud-security', slug: 'cloud-security', name: 'Cloud & Infrastructure Security', certificationTitle: 'Cloud Security & Compliance Certification', desc: 'IAM Roles, Zero Trust Architecture, Compliance, and Security Auditing' },
        ],
      },
      {
        id: 'ece-ee',
        name: 'Electronics, Electrical & Embedded Engineering',
        description: 'Circuit design, microcontrollers, signal processing, power systems, and IoT.',
        skills: [
          { id: 'electronics-communication', slug: 'electronics-communication', name: 'Electronics & Communication Engineering', certificationTitle: 'Electronics & Communication Systems Certification', desc: 'Digital Circuits, Microcontrollers, VLSI Design, and Signal Processing' },
          { id: 'embedded-systems', slug: 'embedded-systems', name: 'Embedded Systems', certificationTitle: 'Embedded Systems & Microcontrollers Certification', desc: 'C/C++ Embedded Programming, Microcontrollers (ARM/ESP32), and RTOS' },
          { id: 'internet-of-things', slug: 'internet-of-things', name: 'Internet of Things (IoT)', certificationTitle: 'Internet of Things (IoT) Architecture Certification', desc: 'Sensor Integration, MQTT Protocol, IoT Gateways, and Smart Devices' },
          { id: 'robotics-automation', slug: 'robotics-automation', name: 'Robotics & Automation', certificationTitle: 'Robotics & Industrial Automation Certification', desc: 'ROS (Robot OS), Kinematics, Control Systems, and Actuators' },
          { id: 'electrical-engineering', slug: 'electrical-engineering', name: 'Electrical Engineering', certificationTitle: 'Electrical Power Systems & Control Certification', desc: 'Power Systems, Control Engineering, Circuit Analysis, and Renewable Energy' },
        ],
      },
      {
        id: 'mech-civil-chem',
        name: 'Mechanical, Civil, Biotech & Chemical Engineering',
        description: 'Physical systems design, CAD modeling, structural mechanics, and industrial processes.',
        skills: [
          { id: 'mechanical-engineering', slug: 'mechanical-engineering', name: 'Mechanical Engineering', certificationTitle: 'Mechanical Engineering & CAD Design Certification', desc: 'Thermodynamics, CAD/CAM, Machine Design, and Fluid Mechanics' },
          { id: 'civil-engineering', slug: 'civil-engineering', name: 'Civil Engineering', certificationTitle: 'Civil & Structural Engineering Certification', desc: 'Structural Analysis, Surveying, Construction Management, and Geotechnical' },
          { id: 'biotechnology-engineering', slug: 'biotechnology-engineering', name: 'Biotechnology Engineering', certificationTitle: 'Biotechnology & Bioinformatics Certification', desc: 'Bioprocess Engineering, Bioinformatics, Gene Editing, and Biomechanics' },
          { id: 'chemical-engineering', slug: 'chemical-engineering', name: 'Chemical Engineering', certificationTitle: 'Chemical Process Engineering Certification', desc: 'Process Control, Mass Transfer, Chemical Kinetics, and Plant Design' },
        ],
      },
    ],
  },
  {
    id: 'bca',
    slug: 'bca',
    title: 'BCA',
    fullName: 'Bachelor of Computer Applications',
    stream: 'tech',
    badge: 'Computer Applications',
    icon: 'Code2',
    gradient: 'from-indigo-600 to-violet-600',
    lightBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    description: '3-year professional computing program centered on software programming, web tech, database systems, and application design.',
    topFields: ['Software Programming', 'Full Stack Development', 'Database Management', 'UI/UX Design'],
    specializations: [
      {
        id: 'prog-web',
        name: 'Programming & Web Development',
        description: 'Core programming languages, modern client-side and server-side web engineering.',
        skills: [
          { id: 'c-cpp-programming', slug: 'c-cpp-programming', name: 'Programming Languages (C / C++)', certificationTitle: 'C & C++ Programming Certification', desc: 'Syntax, Memory Pointers, OOP, Data Structures, and Compilation' },
          { id: 'java-programming', slug: 'java-programming', name: 'Java Programming', certificationTitle: 'Java Software Development Certification', desc: 'Core Java, OOP, Multithreading, JVM, Collection Framework, and Spring' },
          { id: 'python-development', slug: 'python-development', name: 'Python Development', certificationTitle: 'Python Programming Certification', desc: 'Syntax, Functions, Scripting, Modules, OOP, and Backend Frameworks' },
          { id: 'javascript-modern-web', slug: 'javascript-modern-web', name: 'JavaScript & Modern Web', certificationTitle: 'JavaScript ES6+ Web Development Certification', desc: 'ES6+, DOM Manipulation, Async JS, Promises, and Modern Frameworks' },
          { id: 'frontend-development', slug: 'frontend-development', name: 'Frontend Development', certificationTitle: 'Frontend Engineering & React Certification', desc: 'HTML5, Modern CSS3, Tailwind, React, and Responsive Layouts' },
          { id: 'backend-development', slug: 'backend-development', name: 'Backend Development', certificationTitle: 'Backend Architecture & Node.js Certification', desc: 'Node.js, Express.js, REST APIs, Server Routing, and Authentication' },
          { id: 'full-stack-development', slug: 'full-stack-development', name: 'Full Stack Development', certificationTitle: 'Full Stack Web Engineering Certification', desc: 'End-to-end MERN Stack application architecture and deployment' },
        ],
      },
      {
        id: 'db-core',
        name: 'Core Computing & Database Systems',
        description: 'Fundamental computer science foundations, database architecture, and operating environments.',
        skills: [
          { id: 'database-sql', slug: 'database-sql', name: 'Database Management & SQL', certificationTitle: 'Relational Databases & SQL Certification', desc: 'Relational Database Schema, SQL Queries, Joins, Indexing, and ACID' },
          { id: 'data-structures', slug: 'data-structures', name: 'Data Structures & Algorithms', certificationTitle: 'Data Structures & Algorithms Certification', desc: 'Arrays, Linked Lists, Stacks, Queues, Searching, and Sorting' },
          { id: 'computer-networks-admin', slug: 'computer-networks-admin', name: 'Computer Networks & Admin', certificationTitle: 'Computer Networking & Systems Admin Certification', desc: 'OSI Model, IP Addressing, Protocols, Subnetting, and Server Admin' },
          { id: 'operating-systems-bca', slug: 'operating-systems-bca', name: 'Operating Systems', certificationTitle: 'Operating Systems & Linux Admin Certification', desc: 'Linux Shell, Process Management, Memory Allocation, and Filesystem' },
        ],
      },
      {
        id: 'applied-tech',
        name: 'Applied Technology & Digital Domains',
        description: 'Career-ready domains in data, mobile development, security, and interface design.',
        skills: [
          { id: 'mobile-app-dev', slug: 'mobile-app-dev', name: 'Mobile App Development', certificationTitle: 'Mobile App Engineering Certification', desc: 'Cross-platform app building with React Native and Mobile APIs' },
          { id: 'cloud-computing-essentials', slug: 'cloud-computing-essentials', name: 'Cloud Computing Essentials', certificationTitle: 'Cloud Essentials Certification', desc: 'Cloud Fundamentals, IaaS/PaaS, Storage, and Deployment' },
          { id: 'cyber-security-essentials', slug: 'cyber-security-essentials', name: 'Cyber Security Essentials', certificationTitle: 'Cyber Security Essentials Certification', desc: 'Security Hygiene, Threat Vectors, Web Security, and Authentication' },
          { id: 'ui-ux-design', slug: 'ui-ux-design', name: 'UI/UX Design', certificationTitle: 'UI/UX Interface Design Certification', desc: 'Wireframing, Prototyping, Figma, User Centric Design, and Accessibility' },
        ],
      },
    ],
  },
  {
    id: 'bcom',
    slug: 'bcom',
    title: 'B.Com',
    fullName: 'Bachelor of Commerce',
    stream: 'commerce',
    badge: 'Commerce & Finance',
    icon: 'BarChart3',
    gradient: 'from-emerald-600 to-teal-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    description: '3-year comprehensive commercial degree building expertise in accounting, taxation, auditing, financial management, and banking.',
    topFields: ['Accounting & Taxation', 'Banking & Finance', 'Auditing', 'Business Economics & Law'],
    specializations: [
      {
        id: 'acc-tax',
        name: 'Accounting & Taxation',
        description: 'Financial ledger systems, corporate accounting, direct/indirect taxation, and GST compliance.',
        skills: [
          { id: 'financial-accounting', slug: 'financial-accounting', name: 'Financial Accounting', certificationTitle: 'Financial Accounting Specialist Certification', desc: 'Double-entry bookkeeping, Ledger posting, Trial balance, and Financial statements' },
          { id: 'corporate-accounting', slug: 'corporate-accounting', name: 'Corporate Accounting', certificationTitle: 'Corporate Accounting Certification', desc: 'Share capital accounting, Debentures, Amalgamation, and Company balance sheets' },
          { id: 'cost-accounting', slug: 'cost-accounting', name: 'Cost Accounting', certificationTitle: 'Cost & Management Accounting Certification', desc: 'Cost classification, Job costing, Process costing, Budgetary control, and Variance' },
          { id: 'taxation-income-tax', slug: 'taxation-income-tax', name: 'Taxation (Income Tax)', certificationTitle: 'Direct Taxation & Income Tax Certification', desc: 'Tax slabs, Heads of income, Deductions (Sec 80C), Returns, and Assessment' },
          { id: 'gst-indirect-taxes', slug: 'gst-indirect-taxes', name: 'GST & Indirect Taxes', certificationTitle: 'GST Compliance & Indirect Tax Certification', desc: 'Goods & Services Tax rules, CGST/SGST/IGST, E-Way bills, and Input Tax Credit' },
          { id: 'tally-erp-accounting', slug: 'tally-erp-accounting', name: 'Tally & ERP Accounting', certificationTitle: 'Tally Prime & ERP Accounting Certification', desc: 'Tally Prime, Voucher Entry, Inventory Accounting, and Payroll management' },
        ],
      },
      {
        id: 'fin-bank',
        name: 'Finance, Banking & Investment',
        description: 'Capital structure, commercial banking operations, wealth management, and securities markets.',
        skills: [
          { id: 'financial-management', slug: 'financial-management', name: 'Financial Management', certificationTitle: 'Financial Management & Corporate Finance Certification', desc: 'Capital budgeting, Cost of capital, Working capital, and Financial analysis' },
          { id: 'banking-operations', slug: 'banking-operations', name: 'Banking Operations', certificationTitle: 'Commercial Banking Operations Certification', desc: 'Commercial banking, RBI policies, Credit appraisal, Forex, and Digital banking' },
          { id: 'investment-wealth-mgmt', slug: 'investment-wealth-mgmt', name: 'Investment & Wealth Management', certificationTitle: 'Investment & Portfolio Management Certification', desc: 'Mutual funds, Portfolio theory, Asset allocation, Risk management, and Bonds' },
          { id: 'stock-market-securities', slug: 'stock-market-securities', name: 'Stock Market & Securities Law', certificationTitle: 'Stock Market & Equity Trading Certification', desc: 'SEBI regulations, Equity trading, Derivatives, Technical Analysis, and IPOs' },
          { id: 'auditing-assurance', slug: 'auditing-assurance', name: 'Auditing & Assurance', certificationTitle: 'Auditing & Assurance Certification', desc: 'Audit procedures, Internal controls, Vouching, Audit reports, and Ethics' },
        ],
      },
      {
        id: 'biz-econ',
        name: 'Business Economics & Commerce',
        description: 'Economic theories, business law compliance, marketing, and electronic commerce.',
        skills: [
          { id: 'business-economics', slug: 'business-economics', name: 'Business Economics', certificationTitle: 'Business & Managerial Economics Certification', desc: 'Microeconomics, Demand elasticity, Market structures, Macroeconomic policy' },
          { id: 'business-law-regulations', slug: 'business-law-regulations', name: 'Business Law & Corporate Regulations', certificationTitle: 'Business Law & Corporate Regulations Certification', desc: 'Contract Act, Companies Act 2013, Consumer Protection, and Partnership Law' },
          { id: 'marketing-management-bcom', slug: 'marketing-management-bcom', name: 'Marketing Management', certificationTitle: 'Marketing Management Certification', desc: 'Marketing mix (4Ps), Consumer behavior, Market segmentation, and Branding' },
          { id: 'human-resource-mgmt-bcom', slug: 'human-resource-mgmt-bcom', name: 'Human Resource Management', certificationTitle: 'Human Resource Management Certification', desc: 'Recruitment, Performance appraisal, Industrial relations, and Labor laws' },
          { id: 'entrepreneurship-ecom', slug: 'entrepreneurship-ecom', name: 'Entrepreneurship & E-Commerce', certificationTitle: 'Entrepreneurship & E-Commerce Certification', desc: 'Startup valuation, Business model canvas, Digital payments, and E-Retailing' },
        ],
      },
    ],
  },
  {
    id: 'bsc',
    slug: 'bsc',
    title: 'B.Sc',
    fullName: 'Bachelor of Science',
    stream: 'science',
    badge: 'Sciences & Analytics',
    icon: 'FlaskConical',
    gradient: 'from-cyan-600 to-blue-600',
    lightBg: 'bg-cyan-50 dark:bg-cyan-950/40',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    description: '3-year scientific research degree encompassing physical sciences, biological fields, mathematics, statistics, and computer science.',
    topFields: ['Computer Science & IT', 'Mathematics & Statistics', 'Biotechnology & Life Sciences', 'Physics & Chemistry'],
    specializations: [
      {
        id: 'bsc-cs-it',
        name: 'Computer Science, IT & Data Science',
        description: 'Scientific computing, algorithmic problem solving, statistical programming, and data analytics.',
        skills: [
          { id: 'computer-science-fundamentals', slug: 'computer-science-fundamentals', name: 'Computer Science Fundamentals', certificationTitle: 'Computer Science Fundamentals Certification', desc: 'Programming, Data Structures, System Architecture, and Algorithms' },
          { id: 'data-science-stat-computing', slug: 'data-science-stat-computing', name: 'Data Science & Statistical Computing', certificationTitle: 'Data Science & Statistical Computing Certification', desc: 'R Programming, Python Data Libraries, Statistical Inference, and Predictive Analytics' },
          { id: 'information-technology-bsc', slug: 'information-technology-bsc', name: 'Information Technology', certificationTitle: 'Information Technology Systems Certification', desc: 'Network Infrastructure, Web Systems, Database Administration, and System Security' },
        ],
      },
      {
        id: 'math-stat-phy',
        name: 'Mathematics, Statistics & Physics',
        description: 'Mathematical modeling, quantum mechanics, statistical distribution, and analytical physics.',
        skills: [
          { id: 'applied-mathematics', slug: 'applied-mathematics', name: 'Applied Mathematics', certificationTitle: 'Applied Mathematics Certification', desc: 'Calculus, Differential Equations, Linear Algebra, and Numerical Methods' },
          { id: 'statistics-probability', slug: 'statistics-probability', name: 'Statistics & Probability', certificationTitle: 'Statistics & Probability Theory Certification', desc: 'Probability Theory, Sampling, Hypothesis Testing, and Regression Models' },
          { id: 'physics-thermodynamics', slug: 'physics-thermodynamics', name: 'Physics & Thermodynamics', certificationTitle: 'Physics & Quantum Mechanics Certification', desc: 'Classical Mechanics, Quantum Physics, Electromagnetism, and Optics' },
          { id: 'analytical-chemistry', slug: 'analytical-chemistry', name: 'Analytical Chemistry', certificationTitle: 'Analytical & Organic Chemistry Certification', desc: 'Organic/Inorganic Chemistry, Spectroscopy, Chemical Kinetics, and Thermodynamics' },
        ],
      },
      {
        id: 'bio-micro-env',
        name: 'Biotechnology, Microbiology & Life Sciences',
        description: 'Cellular biology, genetic engineering, micro-organisms, and environmental conservation.',
        skills: [
          { id: 'biotechnology-genetics', slug: 'biotechnology-genetics', name: 'Biotechnology & Genetics', certificationTitle: 'Biotechnology & Genetic Engineering Certification', desc: 'Recombinant DNA, Gene Cloning, Molecular Biology, and Bioprocessing' },
          { id: 'microbiology-immunology', slug: 'microbiology-immunology', name: 'Microbiology & Immunology', certificationTitle: 'Microbiology & Immunology Certification', desc: 'Bacteriology, Virology, Immune Systems, Culture Techniques, and Staining' },
          { id: 'biochemistry-molecular-bio', slug: 'biochemistry-molecular-bio', name: 'Biochemistry & Molecular Biology', certificationTitle: 'Biochemistry & Molecular Biology Certification', desc: 'Enzymology, Metabolic Pathways, Proteins, Nucleic Acids, and Assays' },
          { id: 'environmental-science-botany', slug: 'environmental-science-botany', name: 'Environmental Science & Botany', certificationTitle: 'Environmental Science & Botany Certification', desc: 'Ecology, Biodiversity, Climate Science, Plant Physiology, and Ecosystems' },
        ],
      },
    ],
  },
  {
    id: 'bpharm',
    slug: 'bpharm',
    title: 'B.Pharm',
    fullName: 'Bachelor of Pharmacy',
    stream: 'science',
    badge: 'Pharmacy & Healthcare',
    icon: 'Pill',
    gradient: 'from-rose-600 to-pink-600',
    lightBg: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-200 dark:border-rose-800',
    textColor: 'text-rose-600 dark:text-rose-400',
    description: '4-year professional pharmaceutical science degree focusing on drug discovery, pharmacology, pharmaceutics, and clinical safety.',
    topFields: ['Pharmacology', 'Pharmaceutics', 'Pharmaceutical Chemistry', 'Clinical Pharmacy & Regulatory'],
    specializations: [
      {
        id: 'pharmacol-ceutics',
        name: 'Pharmacology & Pharmaceutics',
        description: 'Mechanism of drug action, dosage form design, pharmacokinetics, and drug delivery systems.',
        skills: [
          { id: 'pharmacology', slug: 'pharmacology', name: 'Pharmacology', certificationTitle: 'Pharmacology & Drug Action Certification', desc: 'Drug mechanisms, Receptor interactions, Pharmacodynamics, and Organ System Therapeutics' },
          { id: 'pharmaceutics', slug: 'pharmaceutics', name: 'Pharmaceutics', certificationTitle: 'Pharmaceutics & Formulation Science Certification', desc: 'Formulation Development, Tablets/Capsules, Novel Drug Delivery Systems (NDDS), and Bioavailability' },
          { id: 'pharmacokinetics', slug: 'pharmacokinetics', name: 'Pharmacokinetics & Biopharmaceutics', certificationTitle: 'Pharmacokinetics & ADME Certification', desc: 'Absorption, Distribution, Metabolism, Excretion (ADME), and Elimination Rates' },
          { id: 'pharmacognosy', slug: 'pharmacognosy', name: 'Pharmacognosy & Herbal Drugs', certificationTitle: 'Pharmacognosy & Herbal Medicine Certification', desc: 'Medicinal plants, Phytochemistry, Herbal Formulations, and Extraction Techniques' },
        ],
      },
      {
        id: 'pharm-chem-anal',
        name: 'Pharmaceutical Chemistry & Quality Control',
        description: 'Chemical synthesis of drugs, analytical instrumentation, and pharmaceutical quality assurance.',
        skills: [
          { id: 'pharmaceutical-chemistry', slug: 'pharmaceutical-chemistry', name: 'Pharmaceutical Chemistry', certificationTitle: 'Medicinal & Pharmaceutical Chemistry Certification', desc: 'Medicinal Chemistry, Structure-Activity Relationship (SAR), Drug Design, and Organic Synthesis' },
          { id: 'pharmaceutical-analysis', slug: 'pharmaceutical-analysis', name: 'Pharmaceutical Analysis', certificationTitle: 'Pharmaceutical Analysis & HPLC Certification', desc: 'HPLC, UV-Vis Spectroscopy, Mass Spectrometry, Titrations, and Method Validation' },
          { id: 'quality-control-qa', slug: 'quality-control-qa', name: 'Quality Control & Quality Assurance (QC/QA)', certificationTitle: 'Pharmaceutical Quality Control & QA Certification', desc: 'GMP Guidelines, GLP, Batch Testing, Stability Testing, and SOP Compliance' },
        ],
      },
      {
        id: 'clinical-reg',
        name: 'Clinical Pharmacy, Drug Safety & Regulations',
        description: 'Hospital pharmacy management, clinical trials, pharmacovigilance, and regulatory affairs.',
        skills: [
          { id: 'clinical-pharmacy-therapeutics', slug: 'clinical-pharmacy-therapeutics', name: 'Clinical Pharmacy & Therapeutics', certificationTitle: 'Clinical Pharmacy & Therapeutics Certification', desc: 'Patient Medication Management, Adverse Drug Reactions, Posology, and Clinical Rounds' },
          { id: 'drug-safety-pharmacovigilance', slug: 'drug-safety-pharmacovigilance', name: 'Drug Safety & Pharmacovigilance', certificationTitle: 'Drug Safety & Pharmacovigilance Certification', desc: 'Safety Monitoring, ICSR Reporting, Signal Detection, and Risk Management Plans' },
          { id: 'regulatory-affairs', slug: 'regulatory-affairs', name: 'Regulatory Affairs', certificationTitle: 'Pharmaceutical Regulatory Affairs Certification', desc: 'USFDA, EMA, CDSCO filings, IND/NDA submissions, Drug & Cosmetics Act' },
          { id: 'hospital-community-pharmacy', slug: 'hospital-community-pharmacy', name: 'Hospital & Community Pharmacy', certificationTitle: 'Hospital & Community Pharmacy Certification', desc: 'Inventory Control, Prescription Auditing, Patient Counseling, and Hospital Operations' },
        ],
      },
    ],
  },
  {
    id: 'bba',
    slug: 'bba',
    title: 'BBA',
    fullName: 'Bachelor of Business Administration',
    stream: 'commerce',
    badge: 'Business & Management',
    icon: 'Briefcase',
    gradient: 'from-amber-600 to-orange-600',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-600 dark:text-amber-400',
    description: '3-year management degree designed to cultivate corporate leadership, strategic thinking, marketing acumen, and business analytics.',
    topFields: ['Marketing & Growth', 'Finance & Analytics', 'Human Resource Management', 'Operations & Supply Chain'],
    specializations: [
      {
        id: 'mkt-growth',
        name: 'Marketing & Digital Growth',
        description: 'Brand strategy, consumer insights, digital marketing channels, sales management, and growth engines.',
        skills: [
          { id: 'marketing-management-bba', slug: 'marketing-management-bba', name: 'Marketing Management', certificationTitle: 'Marketing Management Specialist Certification', desc: 'Market Segmentation, Targeting, Positioning (STP), Product Life Cycle, and Pricing' },
          { id: 'digital-marketing-growth', slug: 'digital-marketing-growth', name: 'Digital Marketing & Growth', certificationTitle: 'Digital Marketing & Growth Strategy Certification', desc: 'SEO, SEM, Social Media Strategy, Email Marketing, Content Funnels, and Analytics' },
          { id: 'brand-management', slug: 'brand-management', name: 'Brand Management & Advertising', certificationTitle: 'Brand Management & Advertising Certification', desc: 'Brand Identity, Brand Equity, Campaign Planning, Copywriting, and PR' },
          { id: 'consumer-behavior-research', slug: 'consumer-behavior-research', name: 'Consumer Behavior & Research', certificationTitle: 'Consumer Behavior & Market Research Certification', desc: 'Buyer Psychology, Survey Methods, Focus Groups, and Data Analysis' },
        ],
      },
      {
        id: 'bba-fin-analytics',
        name: 'Finance & Business Analytics',
        description: 'Corporate finance, managerial accounting, quantitative decision modeling, and data-driven strategy.',
        skills: [
          { id: 'financial-management-bba', slug: 'financial-management-bba', name: 'Financial Management', certificationTitle: 'Corporate Financial Management Certification', desc: 'Financial Statement Analysis, Ratio Analysis, Valuation, and Capital Budgeting' },
          { id: 'business-analytics-bi', slug: 'business-analytics-bi', name: 'Business Analytics & Intelligence', certificationTitle: 'Business Analytics & Power BI Certification', desc: 'Excel Modeling, Tableau, Power BI, Business Metrics, and Forecasting' },
          { id: 'corporate-finance-investment', slug: 'corporate-finance-investment', name: 'Corporate Finance & Investment', certificationTitle: 'Corporate Finance & Investment Certification', desc: 'Capital Markets, Mergers & Acquisitions, Risk Assessment, and Portfolio Basics' },
        ],
      },
      {
        id: 'hr-ops-supply',
        name: 'HR, Operations & Entrepreneurship',
        description: 'Talent management, supply chain optimization, international business, and startup launch.',
        skills: [
          { id: 'human-resource-management-bba', slug: 'human-resource-management-bba', name: 'Human Resource Management', certificationTitle: 'Human Resource Management & Talent Acquisition Certification', desc: 'Talent Acquisition, Employee Relations, Training & Development, and Compensation' },
          { id: 'operations-supply-chain', slug: 'operations-supply-chain', name: 'Operations & Supply Chain Management', certificationTitle: 'Operations & Supply Chain Management Certification', desc: 'Logistics, Inventory Control, Lean Management, Quality Systems (Six Sigma), and Procurement' },
          { id: 'entrepreneurship-startup', slug: 'entrepreneurship-startup', name: 'Entrepreneurship & Startup Management', certificationTitle: 'Entrepreneurship & Startup Management Certification', desc: 'Pitching, Business Plans, Product-Market Fit, Fundraising, and Execution' },
        ],
      },
    ],
  },
  {
    id: 'ba',
    slug: 'ba',
    title: 'BA',
    fullName: 'Bachelor of Arts',
    stream: 'design',
    badge: 'Arts & Humanities',
    icon: 'BookOpen',
    gradient: 'from-purple-600 to-indigo-600',
    lightBg: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-600 dark:text-purple-400',
    description: '3-year liberal arts degree building critical thinking, communication, psychological insights, economics, and media expertise.',
    topFields: ['English Literature & Writing', 'Psychology & Behavioral Science', 'Political Science & Economics', 'Journalism & Mass Comm'],
    specializations: [
      {
        id: 'eng-media',
        name: 'Literature, Journalism & Mass Communication',
        description: 'Media production, journalism ethics, literary analysis, content strategy, and public communication.',
        skills: [
          { id: 'english-literature', slug: 'english-literature', name: 'English Literature & Composition', certificationTitle: 'English Literature & Composition Certification', desc: 'Literary Theory, Critical Analysis, Prose, Poetry, Drama, and Stylistics' },
          { id: 'journalism-mass-comm', slug: 'journalism-mass-comm', name: 'Journalism & Mass Communication', certificationTitle: 'Journalism & Mass Communication Certification', desc: 'Print & Digital Reporting, News Writing, Media Ethics, Editing, and Broadcast' },
          { id: 'media-writing-content', slug: 'media-writing-content', name: 'Media Writing & Content Strategy', certificationTitle: 'Media Writing & Content Strategy Certification', desc: 'Copywriting, Blogging, SEO Content Writing, Technical Writing, and Editing' },
        ],
      },
      {
        id: 'psych-soc',
        name: 'Psychology & Behavioral Sciences',
        description: 'Human mind, cognitive processes, organizational behavior, counseling, and social patterns.',
        skills: [
          { id: 'general-cognitive-psychology', slug: 'general-cognitive-psychology', name: 'General & Cognitive Psychology', certificationTitle: 'General & Cognitive Psychology Certification', desc: 'Perception, Memory, Learning Theories, Neuropsychology, and Behavior' },
          { id: 'social-org-psychology', slug: 'social-org-psychology', name: 'Social & Organizational Psychology', certificationTitle: 'Social & Organizational Psychology Certification', desc: 'Group Dynamics, Social Influence, Workplace Behavior, and Motivation' },
          { id: 'clinical-counseling-psychology', slug: 'clinical-counseling-psychology', name: 'Clinical & Counseling Psychology', certificationTitle: 'Clinical & Counseling Psychology Certification', desc: 'Psychological Assessment, Therapeutic Approaches, Mental Health, and Diagnostics' },
        ],
      },
      {
        id: 'pol-econ-hist',
        name: 'Political Science, Economics & History',
        description: 'Governance, international relations, economic systems, and historical evolution of societies.',
        skills: [
          { id: 'political-science-governance', slug: 'political-science-governance', name: 'Political Science & Governance', certificationTitle: 'Political Science & Public Governance Certification', desc: 'Political Thought, Constitutional Systems, Comparative Politics, and Public Policy' },
          { id: 'international-relations', slug: 'international-relations', name: 'International Relations & Diplomacy', certificationTitle: 'International Relations & Diplomacy Certification', desc: 'Foreign Policy, Global Conflict Resolution, International Organizations (UN), and Geopolitics' },
        ],
      },
    ],
  },
  {
    id: 'barch',
    slug: 'barch',
    title: 'B.Arch',
    fullName: 'Bachelor of Architecture',
    stream: 'design',
    badge: 'Architecture & Planning',
    icon: 'Building2',
    gradient: 'from-amber-700 to-yellow-600',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-300 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-400',
    description: '5-year professional architectural degree blending structural engineering, spatial design, urban planning, BIM, and sustainability.',
    topFields: ['Architectural Design', 'BIM & 3D CAD Modeling', 'Urban Planning', 'Sustainable Architecture'],
    specializations: [
      {
        id: 'arch-design-bim',
        name: 'Architectural Design & Digital Tools',
        description: 'Spatial planning, computer-aided architectural drafting, 3D modeling, and Building Information Modeling.',
        skills: [
          { id: 'architectural-design-studio', slug: 'architectural-design-studio', name: 'Architectural Design & Studio', certificationTitle: 'Architectural Design & Studio Certification', desc: 'Spatial Concept Development, Site Planning, Building Typologies, and Design Theory' },
          { id: 'building-information-modeling', slug: 'building-information-modeling', name: 'Building Information Modeling (BIM)', certificationTitle: 'BIM & Revit Architecture Certification', desc: 'Revit Architecture, Parametric Modeling, Clash Detection, and Construction Documentation' },
          { id: 'cad-3d-visualization', slug: 'cad-3d-visualization', name: 'CAD & 3D Architectural Visualization', certificationTitle: 'CAD & 3D Architectural Visualization Certification', desc: 'AutoCAD, Rhino 3D, SketchUp, V-Ray Rendering, and Lumion Animation' },
        ],
      },
      {
        id: 'urban-sustainable',
        name: 'Urban Planning & Sustainable Design',
        description: 'Smart city master planning, landscape architecture, green building ratings, and environmental design.',
        skills: [
          { id: 'urban-planning-smart-cities', slug: 'urban-planning-smart-cities', name: 'Urban Planning & Smart Cities', certificationTitle: 'Urban Planning & Smart Cities Certification', desc: 'Master Planning, Zoning Laws, Transportation Integration, and Public Infrastructure' },
          { id: 'sustainable-green-architecture', slug: 'sustainable-green-architecture', name: 'Sustainable & Green Architecture', certificationTitle: 'Sustainable Architecture & LEED Certification', desc: 'Passive Solar Design, LEED/GRIHA Certification, Energy Modeling, and Net-Zero Buildings' },
        ],
      },
    ],
  },
  {
    id: 'bdes',
    slug: 'bdes',
    title: 'B.Des',
    fullName: 'Bachelor of Design',
    stream: 'design',
    badge: 'Design & Innovation',
    icon: 'Palette',
    gradient: 'from-fuchsia-600 to-pink-600',
    lightBg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
    borderColor: 'border-fuchsia-200 dark:border-fuchsia-800',
    textColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    description: '4-year creative design degree specializing in UI/UX design, graphic communication, industrial product design, and animation.',
    topFields: ['UI/UX & Product Design', 'Graphic & Visual Design', 'Animation & VFX', 'Fashion & Interior Design'],
    specializations: [
      {
        id: 'uiux-digital',
        name: 'UI/UX & Interactive Design',
        description: 'User-centered research, interaction design, digital product wireframing, usability testing, and design systems.',
        skills: [
          { id: 'ui-ux-design-research', slug: 'ui-ux-design-research', name: 'UI/UX Design & Research', certificationTitle: 'UI/UX Design & Product Research Certification', desc: 'User Interviews, Personas, Wireframing, High-Fidelity Prototyping, and Usability Testing' },
          { id: 'design-systems-components', slug: 'design-systems-components', name: 'Design Systems & UI Components', certificationTitle: 'Design Systems & Component Architecture Certification', desc: 'Figma Mastery, Component Libraries, Typography, Grid Systems, and Tokens' },
        ],
      },
      {
        id: 'graphic-anim',
        name: 'Graphic Communication, Animation & VFX',
        description: 'Visual identity, branding, 2D/3D animation, game design, and visual effects production.',
        skills: [
          { id: 'graphic-design-visual-comm', slug: 'graphic-design-visual-comm', name: 'Graphic Design & Visual Communication', certificationTitle: 'Graphic Design & Visual Communication Certification', desc: 'Branding, Layout Design, Typography, Adobe Illustrator, and Photoshop' },
          { id: 'animation-motion-graphics', slug: 'animation-motion-graphics', name: 'Animation & Motion Graphics', certificationTitle: '2D/3D Animation & Motion Graphics Certification', desc: '2D Frame Animation, 3D Character Animation, After Effects, and Storyboarding' },
        ],
      },
    ],
  },
  {
    id: 'bpt',
    slug: 'bpt',
    title: 'BPT',
    fullName: 'Bachelor of Physiotherapy',
    stream: 'science',
    badge: 'Physiotherapy & Rehab',
    icon: 'Activity',
    gradient: 'from-teal-600 to-emerald-600',
    lightBg: 'bg-teal-50 dark:bg-teal-950/40',
    borderColor: 'border-teal-200 dark:border-teal-800',
    textColor: 'text-teal-600 dark:text-teal-400',
    description: '4.5-year healthcare degree focusing on physical rehabilitation, biomechanics, neuro-rehab, sports injury, and musculoskeletal health.',
    topFields: ['Orthopedic Physiotherapy', 'Neurological Rehab', 'Sports Physiotherapy', 'Cardiopulmonary Rehab'],
    specializations: [
      {
        id: 'ortho-neuro',
        name: 'Orthopedic & Neurological Rehabilitation',
        description: 'Musculoskeletal therapy, joint mobilization, stroke rehabilitation, and spinal care.',
        skills: [
          { id: 'orthopedic-physiotherapy', slug: 'orthopedic-physiotherapy', name: 'Orthopedic Physiotherapy', certificationTitle: 'Orthopedic Physiotherapy & Rehab Certification', desc: 'Fracture Rehab, Joint Mobilization, Post-Surgical Rehab, Spine Care, and Manual Therapy' },
          { id: 'neurological-rehabilitation', slug: 'neurological-rehabilitation', name: 'Neurological Rehabilitation', certificationTitle: 'Neurological Rehabilitation Specialist Certification', desc: 'Stroke Rehab, Parkinsonian Care, Cerebral Palsy, Spinal Cord Injuries, and PNF Techniques' },
          { id: 'biomechanics-kinesiology', slug: 'biomechanics-kinesiology', name: 'Biomechanics & Kinesiology', certificationTitle: 'Biomechanics & Kinesiology Certification', desc: 'Gait Analysis, Muscle Mechanics, Postural Analysis, and Human Movement Dynamics' },
        ],
      },
      {
        id: 'sports-cardio-ergo',
        name: 'Sports, Cardiopulmonary & Ergonomics',
        description: 'Athlete recovery, cardiac rehab protocols, electrotherapy, and workplace ergonomic assessment.',
        skills: [
          { id: 'sports-physiotherapy-injury', slug: 'sports-physiotherapy-injury', name: 'Sports Physiotherapy & Injury Care', certificationTitle: 'Sports Physiotherapy & Athletic Rehab Certification', desc: 'Athletic Taping, Acute Sports Trauma, Return-to-Play Protocols, and Performance Rehab' },
          { id: 'cardiopulmonary-physiotherapy', slug: 'cardiopulmonary-physiotherapy', name: 'Cardiopulmonary Physiotherapy', certificationTitle: 'Cardiopulmonary Physiotherapy Certification', desc: 'Chest Physiotherapy, Post-CABG Cardiac Rehab, Breathing Exercises, and ICU Mobility' },
        ],
      },
    ],
  },
  {
    id: 'bhm',
    slug: 'bhm',
    title: 'BHM',
    fullName: 'Bachelor of Hotel Management',
    stream: 'law',
    badge: 'Hotel & Hospitality',
    icon: 'UtensilsCrossed',
    gradient: 'from-orange-600 to-amber-600',
    lightBg: 'bg-orange-50 dark:bg-orange-950/40',
    borderColor: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-600 dark:text-orange-400',
    description: '4-year professional hospitality degree cultivating excellence in culinary arts, hotel operations, front office, food & beverage, and event management.',
    topFields: ['Food & Beverage Operations', 'Culinary Arts & Kitchen Mgmt', 'Front Office & Guest Experience', 'Hospitality Marketing & Events'],
    specializations: [
      {
        id: 'fb-culinary',
        name: 'Food & Beverage Services & Culinary Arts',
        description: 'Restaurant service management, commercial kitchen operations, food safety, and beverage management.',
        skills: [
          { id: 'fb-service-operations', slug: 'fb-service-operations', name: 'Food & Beverage Service Operations', certificationTitle: 'Food & Beverage Service Operations Certification', desc: 'Fine Dining Protocols, Banquets Management, Menu Planning, and Table Service' },
          { id: 'culinary-arts-kitchen', slug: 'culinary-arts-kitchen', name: 'Culinary Arts & Kitchen Operations', certificationTitle: 'Culinary Arts & Commercial Kitchen Certification', desc: 'International Cuisines, Food Production, Garde Manger, Bakery & Confectionery' },
        ],
      },
      {
        id: 'fo-hk-events',
        name: 'Front Office, Housekeeping & Event Management',
        description: 'Property management systems, guest relations, revenue management, and large scale event coordination.',
        skills: [
          { id: 'front-office-pms', slug: 'front-office-pms', name: 'Front Office Operations & PMS', certificationTitle: 'Hotel Front Office Operations & PMS Certification', desc: 'Reservation Systems (Opera/PMS), Guest Check-In, Concierge, and Revenue Management' },
          { id: 'event-mice-management', slug: 'event-mice-management', name: 'Event & MICE Management', certificationTitle: 'Event & MICE Hospitality Management Certification', desc: 'Meetings, Incentives, Conferences, Exhibitions, Wedding Planning, and Protocol' },
        ],
      },
    ],
  },
  {
    id: 'llb',
    slug: 'llb',
    title: 'LLB',
    fullName: 'Bachelor of Laws',
    stream: 'law',
    badge: 'Legal Studies & Law',
    icon: 'Scale',
    gradient: 'from-slate-700 to-zinc-800',
    lightBg: 'bg-slate-100 dark:bg-slate-800/60',
    borderColor: 'border-slate-300 dark:border-slate-700',
    textColor: 'text-slate-800 dark:text-slate-200',
    description: '3/5-year professional law degree developing legal acumen in corporate law, litigation, cyber law, constitutional rights, and intellectual property.',
    topFields: ['Corporate & Commercial Law', 'Cyber Law & Tech Compliance', 'Criminal & Constitutional Law', 'Intellectual Property Law (IPL)'],
    specializations: [
      {
        id: 'corp-cyber-ip',
        name: 'Corporate, Cyber & Intellectual Property Law',
        description: 'Business regulations, digital compliance, privacy policies, patents, and mergers & acquisitions.',
        skills: [
          { id: 'corporate-business-law', slug: 'corporate-business-law', name: 'Corporate & Business Law', certificationTitle: 'Corporate & Business Law Specialist Certification', desc: 'Companies Act, Corporate Governance, Mergers & Acquisitions, Contracts, and Compliance' },
          { id: 'cyber-law-data-privacy', slug: 'cyber-law-data-privacy', name: 'Cyber Law & Data Privacy Compliance', certificationTitle: 'Cyber Law & Data Privacy Compliance Certification', desc: 'IT Act, GDPR, Data Protection, Cybercrime Prosecution, and Digital Evidence' },
          { id: 'intellectual-property-law', slug: 'intellectual-property-law', name: 'Intellectual Property Law (IPL)', certificationTitle: 'Intellectual Property Law & Patents Certification', desc: 'Patents, Trademarks, Copyrights, Trade Secrets, and IP Infringement Litigation' },
        ],
      },
      {
        id: 'crim-const-adr',
        name: 'Criminal, Constitutional & Dispute Resolution',
        description: 'Court advocacy, constitutional rights, criminal procedure, and out-of-court arbitration.',
        skills: [
          { id: 'criminal-law-procedure', slug: 'criminal-law-procedure', name: 'Criminal Law & Procedure', certificationTitle: 'Criminal Law & Criminal Procedure Certification', desc: 'Indian Penal Code / BNS, Criminal Procedure Code (CrPC), Evidence Law, and Bail' },
          { id: 'constitutional-law-human-rights', slug: 'constitutional-law-human-rights', name: 'Constitutional Law & Human Rights', certificationTitle: 'Constitutional Law & Fundamental Rights Certification', desc: 'Fundamental Rights, Writs, Judicial Review, Administrative Law, and PILs' },
          { id: 'arbitration-adr', slug: 'arbitration-adr', name: 'Arbitration & Alternative Dispute Resolution (ADR)', certificationTitle: 'Commercial Arbitration & ADR Certification', desc: 'Mediation, Commercial Arbitration, Conciliation, and Award Enforcement' },
        ],
      },
    ],
  },
];

// Helper: Flatten all skills across all UG degrees for global mapping
export const getAllSkillsList = () => {
  const list = [];
  UG_COURSES.forEach((course) => {
    course.specializations.forEach((spec) => {
      spec.skills.forEach((sk) => {
        list.push({
          ...sk,
          degreeId: course.id,
          degreeTitle: course.title,
          degreeFullName: course.fullName,
          degreeBadge: course.badge,
          fieldId: spec.id,
          fieldName: spec.name,
        });
      });
    });
  });
  return list;
};

// Helper: Find a skill by slug or ID or fuzzy name match
export const findSkillBySlug = (slugOrName) => {
  if (!slugOrName) return null;
  const target = String(slugOrName).toLowerCase().trim();
  const all = getAllSkillsList();

  // 1. Exact match on slug or id
  let match = all.find((s) => s.slug === target || s.id === target);
  if (match) return match;

  // 2. Exact match on name
  match = all.find((s) => s.name.toLowerCase() === target);
  if (match) return match;

  // 3. Partial match on name or slug
  match = all.find((s) => s.name.toLowerCase().includes(target) || target.includes(s.slug));
  return match || null;
};
