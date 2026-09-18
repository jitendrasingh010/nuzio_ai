const { News } = require('../models');

const sampleNews = [
  {
    title: "Next-Gen AI Models Achieve Breakthrough in Real-Time Speech Synthesis",
    summary: "New neural audio architectures generate lifelike conversational speech with sub-50ms latency, enabling interactive real-time news delivery.",
    content: "Researchers have unveiled a new paradigm for neural text-to-speech rendering that eliminates robotic cadence. By combining lightweight streaming transformers with expressive prosody predictors, the model mimics human rhythm, pauses, and inflections. Major audio platforms are already evaluating this system for automated news briefings, hyper-personalized audiobooks, and accessibility tools across consumer devices.",
    category: "AI & Technology",
    language: "English",
    source: "TechCrunch",
    sourceUrl: "https://techcrunch.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    title: "Open-Source Robotics Framework Accelerates Autonomous Warehouse Logistics",
    summary: "Engineers unveil unified robotics control platform reducing deployment times from months to hours for industrial supply chains.",
    content: "A consortium of roboticists and cloud providers has standardized spatial navigation and robotic manipulation APIs. Warehouses utilizing this new framework report a 35% improvement in sorting throughput and instantaneous adaptation to changing fulfillment volumes without custom hardware lock-in.",
    category: "Technology",
    language: "English",
    source: "Wired",
    sourceUrl: "https://wired.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    title: "Venture Inflows Surge into AI Productivity Tools Across Enterprise Verticals",
    summary: "Seed and Series A funding rounds bounce back as specialized enterprise workflow copilots demonstrate defensible customer retention.",
    content: "Venture capital firms deployed over $4 billion into vertical AI startups this quarter. While generic chatbots face valuation compression, specialized solutions tailored to legal compliance, financial auditing, and clinical documentation are securing high valuations driven by rapid corporate contract expansions.",
    category: "Startups",
    language: "English",
    source: "VentureBeat",
    sourceUrl: "https://venturebeat.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 180),
  },
  {
    title: "Global Markets Rally as Central Banks Signal Balanced Inflation Trajectory",
    summary: "Indices climb higher across Asian and European exchanges following encouraging core inflation figures and steady labor statistics.",
    content: "Global equities posted their strongest weekly gains of the quarter. Investors responded enthusiastically to benchmark treasury yields easing, while tech and consumer discretionary shares drove the broader composite higher. Analysts note corporate earnings guidance remains resilient despite macro headwinds.",
    category: "Financial Markets",
    language: "English",
    source: "Bloomberg",
    sourceUrl: "https://bloomberg.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    title: "Decentralized Settlement Protocols Gain Traction with Institutional Custodians",
    summary: "Leading treasury desks pilot real-time atomic settlement pipelines to reduce cross-border reconciliation overhead.",
    content: "Tier-one banking institutions are increasingly piloting distributed asset ledgers for intraday liquidity management. By settling cross-currency transactions instantly, institutions estimate potential savings of up to 40% in collateral buffer allocations.",
    category: "Finance",
    language: "English",
    source: "Financial Times",
    sourceUrl: "https://ft.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 240),
  },
  {
    title: "Sustainable Manufacturing Directives Reshape Global Automotive Supply Chains",
    summary: "Automakers pivot toward closed-loop battery recycling facilities and low-emission aluminum alloys to satisfy compliance standards.",
    content: "A worldwide push for supply chain transparency is compelling automotive leaders to audit Tier 2 and Tier 3 suppliers. Investments in localized battery cathode production and circular aluminum smelting have risen sharply, mitigating geopolitical transport vulnerabilities.",
    category: "Business",
    language: "English",
    source: "Reuters",
    sourceUrl: "https://reuters.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 300),
  },
  {
    title: "Targeted RNA Therapies Demonstrate Remarkable Efficacy in Phase 3 Trials",
    summary: "Novel mRNA delivery vectors exhibit selective targeting of oncology markers with minimal systemic toxicity.",
    content: "Clinical trials published in premier medical journals indicate groundbreaking progress in personalized genetic therapeutics. The new lipid nanoparticle carrier ensures localized payload delivery, significantly reducing off-target side effects in clinical cohorts.",
    category: "Healthcare",
    language: "English",
    source: "STAT News",
    sourceUrl: "https://statnews.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 360),
  },
  {
    title: "Deep Space Observatories Discover Water Vapor Spectra on Earth-Sized Exoplanet",
    summary: "Atmospheric transmission spectroscopy reveals atmospheric water indicators on rocky world situated in habitable stellar zone.",
    content: "Astronomers utilizing space telescope infrared detectors have captured the spectroscopic fingerprint of water vapor within the atmosphere of an exoplanet 48 light-years away. Further spectroscopic passes are scheduled to analyze methane and ozone biosignatures.",
    category: "Science",
    language: "English",
    source: "Nature",
    sourceUrl: "https://nature.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 420),
  },
  {
    title: "Championship Tournament Delivers Thrilling Finish as Underdogs Claim Historic Title",
    summary: "In a stunning display of tactical discipline, underdog squad overturns late deficit in extra time to secure the championship trophy.",
    content: "Fans witnessed one of the most exhilarating tournament finals in recent sports history. A spectacular late counter-attack sealed victory, sparking jubilant celebrations and rewriting league records for the fastest decisive rally in post-season play.",
    category: "Sports",
    language: "English",
    source: "ESPN",
    sourceUrl: "https://espn.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 150),
  },
  {
    title: "Multinational Clean Energy Accord Establishes 50-Gigawatt Solar Corridor",
    summary: "Allied nations sign binding infrastructure commitment to interconnect cross-border renewable electricity grids by 2028.",
    content: "Delegates from ten countries finalized a historic clean energy pact today. The initiative funds high-voltage direct-current transmission cables connecting solar-rich desert regions with industrial coastal centers, ensuring resilient 24/7 green power distribution.",
    category: "Global News",
    language: "English",
    source: "BBC World",
    sourceUrl: "https://bbc.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 500),
  },
  {
    title: "कृत्रिम बुद्धिमत्ता और भारतीय स्टार्टअप्स: तकनीकी नवाचार में नया अध्याय",
    summary: "भारतीय टेक इकोसिस्टम में जनरेटिव एआई और ऑटोमेशन टूल्स का उपयोग तेजी से बढ़ रहा है, जिससे वैश्विक स्तर पर नई पहचान मिल रही है।",
    content: "भारत के स्टार्टअप इकोसिस्टम में आर्टिफिशियल इंटेलिजेंस आधारित समाधानों की मांग में भारी उछाल आया है। टियर-2 और टियर-3 शहरों में स्थानीय भाषाओं में एआई सेवाएं देने वाले नए स्टार्टअप्स ने निवेशकों का ध्यान आकर्षित किया है। यह नई तकनीक कृषि, स्वास्थ्य और वित्तीय समावेशन में बड़े बदलाव ला रही है।",
    category: "AI & Technology",
    language: "Hindi",
    source: "Dainik Bhaskar",
    sourceUrl: "https://bhaskar.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    title: "शेयर बाजार में मजबूती: आईटी और ऑटोमोबाइल सेक्टर में शानदार तेजी",
    summary: "घरेलू शेयर बाजारों में आज उत्साहजनक रुख देखा गया। निवेशकों की चौतरफा खरीदारी से प्रमुख सूचकांक नए उच्चतम स्तर पर पहुंचे।",
    content: "सकारात्मक वैश्विक संकेतों और मजबूत तिमाही नतीजों के दम पर भारतीय शेयर बाजार आज बढ़त के साथ बंद हुआ। विदेशी संस्थागत निवेशकों की निरंतर खरीदारी और खुदरा भागीदारी ने बाजार को अतिरिक्त मजबूती प्रदान की है। विश्लेषकों का मानना है कि आने वाले दिनों में यह सकारात्मक गति बनी रह सकती है।",
    category: "Financial Markets",
    language: "Hindi",
    source: "Navbharat Times",
    sourceUrl: "https://navbharattimes.indiatimes.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 110),
  },
  {
    title: "इसरो का आगामी सौर मिशन: अंतरिक्ष विज्ञान में भारत की नई ऊंची उड़ान",
    summary: "भारतीय अंतरिक्ष अनुसंधान संगठन नए वैज्ञानिक उपग्रहों के साथ सौर वायुमंडल और गहरे अंतरिक्ष रहस्यों की खोज में जुटा है।",
    content: "भारतीय वैज्ञानिकों ने अंतरिक्ष अन्वेषण में एक और महत्वपूर्ण मील का पत्थर स्थापित किया है। अत्याधुनिक पेलोड से सुसज्जित नए उपग्रह सौर तूफानों और अंतरिक्ष मौसम के पृथ्वी पर पड़ने वाले प्रभावों का विस्तृत अध्ययन करेंगे। दुनिया भर के वैज्ञानिक इस डेटा का उत्सुकता से इंतजार कर रहे हैं।",
    category: "Science",
    language: "Hindi",
    source: "Amar Ujala",
    sourceUrl: "https://amarujala.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 200),
  },
  {
    title: "क्रिकेट विश्वकप अभियान: टीम इंडिया ने रोमांचक मुकाबले में दर्ज की शानदार जीत",
    summary: "रोमांचक अंतिम ओवरों में बेहतरीन गेंदबाजी और ठोस साझेदारी की बदौलत टीम ने सेमीफाइनल में अपनी जगह पक्की की।",
    content: "स्टेडियम में उमड़े हजारों दर्शकों के सामने टीम ने अनुशासित खेल का प्रदर्शन किया। कप्तान की धैर्यपूर्ण पारी और तेज गेंदबाजों के घातक स्पेल ने मैच का रुख पलट दिया। खेल प्रेमियों ने इस ऐतिहासिक जीत का पूरे उत्साह के साथ जश्न मनाया।",
    category: "Sports",
    language: "Hindi",
    source: "Hindustan",
    sourceUrl: "https://livehindustan.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 170),
  },
  {
    title: "वैश्विक जलवायु सम्मेलन: हरित ऊर्जा और सौर ग्रिड विस्तार पर ऐतिहासिक समझौता",
    summary: "अंतरराष्ट्रीय प्रतिनिधियों ने कार्बन उत्सर्जन में कटौती और सौर ऊर्जा परियोजनाओं को वित्तीय सहायता प्रदान करने पर सहमति जताई।",
    content: "पर्यावरण संरक्षण की दिशा में वैश्विक नेताओं ने एक महत्वपूर्ण समझौते पर हस्ताक्षर किए हैं। इस पहल के तहत विकासशील देशों को स्वच्छ ऊर्जा तकनीक अपनाने के लिए विशेष कोष उपलब्ध कराया जाएगा, जिससे नवीकरणीय ऊर्जा स्रोतों का तेजी से विस्तार होगा।",
    category: "Global News",
    language: "Hindi",
    source: "BBC Hindi",
    sourceUrl: "https://bbc.com/hindi",
    publishedAt: new Date(Date.now() - 1000 * 60 * 320),
  },
  {
    title: "स्वास्थ्य सेवा में डिजिटल क्रांति: टेलीमेडिसिन से ग्रामीण क्षेत्रों में त्वरित इलाज",
    summary: "डिजिटल प्लेटफॉर्म्स और मोबाइल क्लीनिकों के माध्यम से विशेषज्ञ डॉक्टरों की सेवाएं अब दूरदराज के गांवों तक आसानी से पहुंच रही हैं।",
    content: "आधुनिक तकनीक ने ग्रामीण स्वास्थ्य सेवाओं की तस्वीर बदल दी है। हाई-स्पीड इंटरनेट और एआई-संचालित निदान टूल्स की मदद से स्थानीय स्वास्थ्य केंद्रों पर ही गंभीर बीमारियों की समय पर पहचान संभव हो पा रही है। इससे मरीजों को अनावश्यक यात्रा और खर्च से राहत मिली है।",
    category: "Healthcare",
    language: "Hindi",
    source: "NDTV India",
    sourceUrl: "https://ndtv.in",
    publishedAt: new Date(Date.now() - 1000 * 60 * 280),
  },
];

const seedNews = async () => {
  try {
    const count = await News.count();
    if (count === 0) {
      console.log('Seeding initial news stories into database...');
      await News.bulkCreate(sampleNews);
      console.log(`Successfully seeded ${sampleNews.length} news stories.`);
    } else {
      console.log(`Database already contains ${count} news stories. Seed skipped.`);
    }
  } catch (error) {
    console.error('Error seeding news:', error.message);
  }
};

module.exports = { seedNews, sampleNews };
