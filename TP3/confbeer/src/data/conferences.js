
export const conferences = [
  {
    id: 1,
    title: "Innovación en Cervezas Artesanales",
    speaker: "Carlos Rodríguez",
    time: "10:00 - 11:30",
    description: "Descubre las últimas tendencias en cervezas artesanales y cómo innovar en sabores.",
    fullDescription: "En esta conferencia exploraremos las técnicas más innovadoras en la elaboración de cervezas artesanales. Analizaremos casos de éxito de microcervecerías que han revolucionado el mercado con sus propuestas únicas. Aprenderás sobre ingredientes no convencionales, procesos de fermentación alternativos y cómo crear perfiles de sabor que destaquen en un mercado cada vez más competitivo.",
    topics: [
      "Técnicas de fermentación avanzada",
      "Ingredientes innovadores",
      "Marketing para cervezas premium",
      "Casos de éxito internacionales"
    ],
    image: require('../../assets/beer1.jpg'),
    location: {
      latitude: -32.48455,
      longitude: -58.23206,
      address: "Plaza Ramírez, Concepción del Uruguay"
    }
  },
  {
    id: 2,
    title: "Cata Profesional de Cervezas",
    speaker: "María González",
    time: "12:00 - 13:30",
    description: "Aprende las técnicas profesionales para catar cerveza como un experto.",
    fullDescription: "María González, sommelier de cerveza certificada, te guiará a través del mundo de la cata profesional. Aprenderás a identificar aromas, sabores y defectos en diferentes estilos de cerveza. Esta sesión incluirá una cata práctica de 5 estilos diferentes donde aplicarás los conocimientos adquiridos. Perfecto para quienes desean refinar su paladar o iniciarse en el mundo de la cerveza artesanal.",
    topics: [
      "Técnicas de cata profesional",
      "Identificación de aromas y sabores",
      "Detectando defectos comunes",
      "Pairing con alimentos"
    ],
    image: require('../../assets/beer2.jpg'),
    location: {
      latitude: -32.48827,
      longitude: -58.21539,
      address: "Costanera del Uruguay, Isla del Puerto"
    }
  },
  {
    id: 3,
    title: "Cervezas con Identidad Regional",
    speaker: "Javier Méndez",
    time: "14:00 - 15:30",
    description: "Cómo incorporar ingredientes locales para crear cervezas con identidad territorial.",
    fullDescription: "Javier Méndez, maestro cervecero con más de 15 años de experiencia, compartirá su conocimiento sobre cómo utilizar ingredientes locales para crear cervezas únicas con identidad regional. Descubrirás cómo seleccionar y procesar frutas, hierbas y otros ingredientes autóctonos para incorporarlos en tus recetas. Una mirada profunda a cómo la cerveza puede convertirse en un reflejo de la cultura y territorio donde se produce.",
    topics: [
      "Selección de ingredientes locales",
      "Técnicas de incorporación",
      "Mantenimiento de calidad",
      "Comercialización de productos regionales"
    ],
    image: require('../../assets/beer3.jpg'),
    location: {
      latitude: -32.42697,
      longitude: -58.52395,
      address: "Palacio San José Museum Area"
    }
  },
  {
    id: 4,
    title: "Gestión de Microcervecerías",
    speaker: "Ana López",
    time: "16:00 - 17:30",
    description: "Estrategias empresariales para hacer crecer tu microcervecería de manera sostenible.",
    fullDescription: "Ana López, consultora especializada en negocios de bebidas artesanales, te proporcionará las herramientas necesarias para gestionar exitosamente tu microcervecería. Desde control de costos y gestión de inventarios hasta estrategias de marketing digital y expansión. Aprende de casos reales de cervecerías que han escalado sus operaciones manteniendo la calidad y esencia artesanal.",
    topics: [
      "Control de costos y rentabilidad",
      "Estrategias de marketing efectivas",
      "Gestión de distribución",
      "Expansión sostenible"
    ],
    image: require('../../assets/beer4.jpg'),
    location: {
      latitude: -32.48524,
      longitude: -58.24203,
      address: "Terminal de Ómnibus, Zona Centro"
    }
  },
  {
    id: 5,
    title: "Cervezas de Estación",
    speaker: "Roberto Silva",
    time: "18:00 - 19:30",
    description: "Diseña cervezas especiales para cada estación del año que cautiven a tus clientes.",
    fullDescription: "Roberto Silva, reconocido por sus creaciones estacionales premiadas internacionalmente, te enseñará el arte de diseñar cervezas que capturen la esencia de cada temporada. Aprenderás a seleccionar ingredientes, diseñar recetas y comercializar cervezas limitadas que generen expectativa y fidelidad entre tus consumidores. Incluye recetas exclusivas para cada estación del año.",
    topics: [
      "Diseño de recetas estacionales",
      "Ingredientes por temporada",
      "Marketing de ediciones limitadas",
      "Creación de expectativa en consumidores"
    ],
    image: require('../../assets/beer5.jpg'),
    location: {
      latitude: -32.49581,
      longitude: -58.22965,
      address: "Barrio Universitario, near UTN"
    }
  },
  {
    id: 6,
    title: "Técnicas de Amargor Controlado",
    speaker: "Diego Fernández",
    time: "10:00 - 11:30 (Día 2)",
    description: "Domina el arte del amargor en la cerveza para crear perfiles balanceados y complejos.",
    fullDescription: "Diego Fernández, ingeniero en alimentos especializado en lúpulos, te guiará a través de las técnicas más avanzadas para controlar y perfeccionar el amargor en tus cervezas. Aprenderás sobre variedades de lúpulo, momentos de adición, técnicas de dry hopping y cómo lograr el balance perfecto entre amargor, maltas y otros componentes. Incluye sesión práctica de medición de IBUs.",
    topics: [
      "Variedades de lúpulo y sus características",
      "Técnicas de adición y momentos clave",
      "Medición y control de IBUs",
      "Balance de sabores y aromas"
    ],
    image: require('../../assets/beer6.jpg'),
    location: {
      latitude: -32.49361,
      longitude: -58.31231,
      address: "Zona Industrial, near Cervecerías"
    }
  },
  {
    id: 7,
    title: "Cervezas Históricas y Recetas Antiguas",
    speaker: "Laura Martínez",
    time: "12:00 - 13:30 (Día 2)",
    description: "Revive recetas históricas y descubre cómo se elaboraba cerveza en diferentes épocas.",
    fullDescription: "Laura Martínez, historiadora y cervecera, te transportará a través del tiempo para explorar las técnicas y recetas cerveceras de diferentes civilizaciones y épocas históricas. Desde las cervezas egipcias y mesopotámicas hasta las recetas medievales y coloniales. Incluye demostración práctica de elaboración con métodos históricos y cata de recreaciones de cervezas antiguas.",
    topics: [
      "Cervezas en la antigüedad",
      "Técnicas históricas de elaboración",
      "Ingredientes utilizados a través del tiempo",
      "Recreación de recetas históricas"
    ],
    image: require('../../assets/beer7.jpg'),
    location: {
      latitude: -32.48206,
      longitude: -58.23085,
      address: "Museo Casa Delio Panizza, Área Histórica"
    }
  },
  {
    id: 8,
    title: "Cervezas Sin Alcohol Artesanales",
    speaker: "Pablo Rodríguez",
    time: "14:00 - 15:30 (Día 2)",
    description: "Técnicas para elaborar cervezas sin alcohol con todo el sabor de las artesanales.",
    fullDescription: "Pablo Rodríguez, pionero en cervezas sin alcohol artesanales en Argentina, compartirá sus técnicas patentadas para elaborar cervezas sin alcohol que mantienen todo el carácter y sabor de las cervezas artesanales tradicionales. Aprenderás sobre los diferentes métodos de dealcoholización, cómo ajustar recetas y las particularidades del mercado de cervezas sin alcohol, uno de los segmentos de mayor crecimiento.",
    topics: [
      "Métodos de dealcoholización",
      "Ajuste de recetas para cervezas sin alcohol",
      "Mercado y consumidores de cervezas sin alcohol",
      "Tendencias y oportunidades comerciales"
    ],
    image: require('../../assets/beer8.jpg'),
    location: {
      latitude: -32.4859,
      longitude: -58.2183,
      address: "Club Social, Zona Norte"
    }
  },
  {
    id: 9,
    title: "Envases y Conservación de Cerveza",
    speaker: "Sofía Herrera",
    time: "16:00 - 17:30 (Día 2)",
    description: "Optimiza el envasado de tu cerveza para maximizar su vida útil y calidad.",
    fullDescription: "Sofía Herrera, especialista en packaging y conservación de bebidas, te enseñará todo lo que necesitas saber sobre el envasado correcto de la cerveza artesanal. Desde la selección de botellas, tapas y latas hasta las técnicas de llenado, pasteurización y conservación. Aprende a evitar los defectos más comunes relacionados con el envasado y cómo garantizar que tu cerveza llegue al consumidor en perfectas condiciones.",
    topics: [
      "Selección de materiales de envasado",
      "Técnicas de llenado y sellado",
      "Control de oxígeno y luz",
      "Vida útil y conservación"
    ],
    image: require('../../assets/beer9.jpg'),
    location: {
      latitude: -32.4743,
      longitude: -58.2286,
      address: "Parque Unzué, Área Recreativa"
    }
  },
  {
    id: 10,
    title: "Cervezas Experimentales con Levaduras Silvestres",
    speaker: "Miguel Ángel Torres",
    time: "18:00 - 19:30 (Día 2)",
    description: "Aventúrate en el mundo de las fermentaciones espontáneas y levaduras silvestres.",
    fullDescription: "Miguel Ángel Torres, conocido por sus innovadoras cerveas con levaduras autóctonas, te introducirá al fascinante mundo de las fermentaciones espontáneas y el uso de levaduras silvestres. Aprenderás técnicas de captura, identificación y cultivo de levaduras autóctonas, así como los métodos tradicionales y modernos para elaborar cervezas ácidas, lambics y otros estilos que utilizan fermentación salvaje. Incluye demostración de captura de levaduras.",
    topics: [
      "Técnicas de captura de levaduras silvestres",
      "Métodos de fermentación espontánea",
      "Control de fermentaciones salvajes",
      "Elaboración de cervezas ácidas và lambics"
    ],
    image: require('../../assets/beer10.jpg'),
    location: {
      latitude: -32.50115,
      longitude: -58.22885,
      address: "Camping Municipal, Zona Río"
    }
  }
];