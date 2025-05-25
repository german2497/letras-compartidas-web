
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl?: string;
  author: string;
  date: string;
  content?: string; // Full content for article page
  dataAiHint?: string; 
}

export interface Book {
  id: string;
  title: string;
  coverUrl: string;
  synopsis: string;
  author: string;
  commentCount: number;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string; // Used as a title/brief alt text
  shortDescription: string; // For the grid card
  longDescription: string; // For the detail page
  commentCount: number;
  dataAiHint?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string; // ISO date string
  commentCount: number;
  likes: number;
  dislikes: number;
  dataAiHint?: string;
  genre?: string; 
  category?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string; // ISO date string
}

export interface BookComment {
  id: string;
  bookId: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string; // ISO date string
}

export interface ImageComment {
  id: string;
  imageId: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string; // ISO date string
}


export interface CarouselSlide {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  linkUrl?: string; // Optional link for the slide
  dataAiHint?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  hotmartLink: string;
  tags?: string[];
}

export interface GameDocument {
  id: string;
  title: string;
  description: string;
  longDescription?: string; // For detail page
  coverImageUrl: string; // For a representative image
  pdfUrl: string; // URL to the PDF file
  pdfFileName?: string; // To display the name of the uploaded PDF
  dataAiHint?: string; // For the cover image
  commentCount: number;
}

export interface GameDocumentComment {
  id: string;
  documentId: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string; // ISO date string
}

export interface Conference {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube or Vimeo embed URL
  thumbnailUrl: string;
  dataAiHint?: string; // For the thumbnail image
  date: string; // Date of the conference
}


export let placeholderArticles: Article[] = [
  {
    id: '1',
    title: 'El Arte de la Escritura Concisa',
    slug: 'arte-escritura-concisa',
    excerpt: 'Descubre cómo la brevedad puede potenciar tu mensaje y cautivar a tus lectores.',
    imageUrl: 'https://placehold.co/600x400.png',
    author: 'Autor Principal',
    date: '2024-07-15',
    content: '<p>La escritura concisa es una habilidad invaluable en el mundo actual, donde la atención es un recurso escaso. Aprender a expresar ideas de manera clara y directa no solo mejora la comunicación, sino que también demuestra respeto por el tiempo del lector.</p><p>Algunas técnicas incluyen:</p><ul><li>Eliminar palabras redundantes.</li><li>Usar verbos activos.</li><li>Ser específico.</li></ul><p>Practicar la concisión te convertirá en un comunicador más efectivo y persuasivo.</p>',
    dataAiHint: "writing book"
  },
  {
    id: '2',
    title: 'La Importancia de la Lectura Crítica',
    slug: 'importancia-lectura-critica',
    excerpt: 'Explorando cómo la lectura crítica moldea el pensamiento y fomenta la comprensión profunda.',
    imageUrl: 'https://placehold.co/600x400.png',
    author: 'Autor Principal',
    date: '2024-07-10',
    content: '<p>La lectura crítica va más allá de la simple decodificación de palabras. Implica analizar, evaluar y cuestionar el texto para formar un juicio informado. Esta habilidad es fundamental para el desarrollo intelectual y la participación ciudadana.</p><p>Fomentar la lectura crítica en la educación es clave para formar individuos pensantes y autónomos.</p>',
    dataAiHint: "person reading"
  },
  {
    id: '3',
    title: 'Construyendo Comunidades a Través de las Palabras',
    slug: 'comunidades-palabras',
    excerpt: 'Cómo la escritura y el diálogo pueden unir a las personas y crear lazos significativos.',
    imageUrl: 'https://placehold.co/600x400.png',
    author: 'Autor Principal',
    date: '2024-07-05',
    content: '<p>Las palabras tienen el poder de construir puentes. En la era digital, las comunidades en línea se forman en torno a intereses compartidos, y la escritura juega un papel central en esta dinámica. Desde blogs hasta foros, compartir textos y debatir ideas fortalece los lazos sociales.</p><p>Este sitio aspira a ser un ejemplo de cómo la escritura puede fomentar una comunidad vibrante y solidaria.</p>',
    dataAiHint: "community connection"
  },
];

export let placeholderBooks: Book[] = [
  {
    id: '1',
    title: 'El Laberinto de las Palabras',
    coverUrl: 'https://placehold.co/300x450.png',
    synopsis: 'Una novela que explora el poder del lenguaje y los secretos que se esconden en las bibliotecas antiguas.',
    author: 'Autor Principal',
    commentCount: 2,
  },
  {
    id: '2',
    title: 'Crónicas de un Lector Empedernido',
    coverUrl: 'https://placehold.co/300x450.png',
    synopsis: 'Ensayos sobre el placer de la lectura y el impacto transformador de los libros en la vida de una persona.',
    author: 'Autor Principal',
    commentCount: 1,
  },
  {
    id: '3',
    title: 'Manual de Escritura Creativa',
    coverUrl: 'https://placehold.co/300x450.png',
    synopsis: 'Guía práctica con ejercicios y consejos para desbloquear tu potencial como escritor.',
    author: 'Autor Principal',
    commentCount: 0,
  },
];

export let placeholderGalleryImages: GalleryImage[] = [
  { 
    id: 'gal1', 
    src: 'https://placehold.co/400x400.png', 
    alt: 'Escultura Abstracta Moderna', 
    shortDescription: 'Una exploración de formas y texturas en metal pulido.',
    longDescription: 'Esta escultura abstracta, creada por un artista contemporáneo anónimo, juega con la luz y la sombra para evocar una sensación de movimiento y fluidez. Las curvas pulidas contrastan con los bordes afilados, invitando al espectador a una contemplación detallada desde múltiples ángulos. La pieza busca representar la complejidad de las emociones humanas a través de formas no figurativas.',
    commentCount: 2,
    dataAiHint: 'sculpture abstract' 
  },
  { 
    id: 'gal2', 
    src: 'https://placehold.co/400x400.png', 
    alt: 'Paisaje Impresionista', 
    shortDescription: 'Campos de lavanda bajo un cielo vibrante al atardecer.',
    longDescription: 'Inspirada en los maestros impresionistas, esta pintura captura la serena belleza de un campo de lavanda al caer la tarde. Las pinceladas sueltas y la paleta de colores cálidos transmiten la atmósfera efímera del momento. El artista utiliza la técnica del empaste para dar textura a las flores y al cielo.',
    commentCount: 1,
    dataAiHint: 'painting landscape' 
  },
  { 
    id: 'gal3', 
    src: 'https://placehold.co/400x400.png', 
    alt: 'Retrato Callejero en B&N', 
    shortDescription: 'La mirada penetrante de un anciano en un mercado concurrido.',
    longDescription: 'Esta fotografía en blanco y negro, tomada en un bullicioso mercado callejero, se centra en la expresiva mirada de un anciano. El contraste entre las luces y las sombras acentúa las arrugas de su rostro, contando historias de una vida vivida. El fotógrafo ha logrado capturar un momento de introspección en medio del caos.',
    commentCount: 0,
    dataAiHint: 'street photography' 
  },
  { 
    id: 'gal4', 
    src: 'https://placehold.co/400x400.png', 
    alt: 'Detalle Arquitectónico Gótico', 
    shortDescription: 'Una gárgola observando desde lo alto de una catedral centenaria.',
    longDescription: 'Un primer plano de una gárgola de piedra, parte de la ornamentación de una catedral gótica. Su expresión grotesca y su posición elevada son características de este estilo arquitectónico. La textura erosionada de la piedra habla del paso del tiempo y de las inclemencias meteorológicas a las que ha estado expuesta durante siglos.',
    commentCount: 0,
    dataAiHint: 'architecture detail' 
  },
  { 
    id: 'gal5', 
    src: 'https://placehold.co/400x400.png', 
    alt: 'Manuscrito Iluminado Medieval', 
    shortDescription: 'Página de un códice antiguo con caligrafía elaborada y pan de oro.',
    longDescription: 'Esta imagen muestra una página de un manuscrito iluminado de la Edad Media. La caligrafía gótica, las intrincadas iniciales decoradas y el uso de pan de oro son típicos de los libros producidos en los scriptoria monásticos de la época. Cada detalle es un testimonio de la habilidad y dedicación de los copistas e iluminadores.',
    commentCount: 0,
    dataAiHint: 'manuscript ancient' 
  },
  { 
    id: 'gal6', 
    src: 'https://placehold.co/400x400.png', 
    alt: 'Instalación de Arte Lumínico', 
    shortDescription: 'Juego de luces de neón creando patrones abstractos en un espacio oscuro.',
    longDescription: 'Una instalación de arte contemporáneo que utiliza tubos de neón de colores para transformar un espacio oscuro en una experiencia inmersiva. Los patrones geométricos y los cambios de color invitan al espectador a interactuar con la obra y a reflexionar sobre la percepción y el espacio. La obra explora la relación entre la luz, el color y la forma.',
    commentCount: 0,
    dataAiHint: 'art installation' 
  },
];

export let placeholderForumPosts: ForumPost[] = [
  {
    id: 'post1',
    title: 'Mi primer intento de poesía',
    content: 'Quisiera compartir con ustedes este poema que escribí anoche. Acepto críticas constructivas!\n\nEn el lienzo oscuro de la noche,\nestrellas titilan, faros de plata.\nUn susurro de viento, voz que derroche,\nsecretos antiguos que el alma desata.',
    imageUrl: 'https://placehold.co/600x300.png',
    author: { id: 'user1', name: 'Ana Literata', avatarUrl: 'https://placehold.co/50x50.png?text=AL' },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    commentCount: 3,
    likes: 78, 
    dislikes: 1,
    dataAiHint: 'poetry writing',
    genre: 'Poesía',
    category: 'Compartir Poesía',
  },
  {
    id: 'post2',
    title: 'Reflexión sobre "Cien años de soledad"',
    content: 'Acabo de releer esta obra maestra y me gustaría saber qué impacto tuvo en ustedes. Para mí, la forma en que Márquez maneja el tiempo y la familia es simplemente genial.',
    author: { id: 'user2', name: 'Carlos Lector', avatarUrl: 'https://placehold.co/50x50.png?text=CL' },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    commentCount: 5,
    likes: 105,
    dislikes: 0,
    genre: 'Realismo Mágico',
    category: 'Reseñas de Libros',
  },
  {
    id: 'post3',
    title: 'Buscando inspiración para un cuento corto',
    content: 'Hola comunidad, estoy un poco bloqueado. ¿Tienen alguna técnica para encontrar ideas para cuentos cortos? Agradecería sus consejos.',
    imageUrl: 'https://placehold.co/600x300.png',
    author: { id: 'user3', name: 'Sofía Creativa', avatarUrl: 'https://placehold.co/50x50.png?text=SC' },
    createdAt: new Date().toISOString(),
    commentCount: 2,
    likes: 55, 
    dislikes: 2,
    dataAiHint: 'writer inspiration',
    genre: 'Cuento',
    category: 'Ayuda Escritura',
  },
  {
    id: 'post4',
    title: 'Debate: ¿El futuro de los libros es digital?',
    content: 'Con la proliferación de e-readers y audiolibros, ¿creen que el libro físico tiene los días contados? Me gustaría conocer sus opiniones.',
    author: { id: 'user4', name: 'Marcos Debatiente', avatarUrl: 'https://placehold.co/50x50.png?text=MD' },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    commentCount: 8,
    likes: 92,
    dislikes: 3,
    genre: 'Ensayo',
    category: 'Discusión General',
  },
  {
    id: 'post5',
    title: 'Mi rincón de lectura favorito',
    content: 'Comparto una foto de mi lugar especial para sumergirme en la lectura. ¿Cuál es el suyo?',
    imageUrl: 'https://placehold.co/600x300.png',
    author: { id: 'user1', name: 'Ana Literata', avatarUrl: 'https://placehold.co/50x50.png?text=AL' },
    createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(), // 12 hours ago
    commentCount: 4,
    likes: 68,
    dislikes: 0,
    dataAiHint: 'reading nook',
    category: 'Comunidad',
  },
  {
    id: 'post6',
    title: 'Recomendación de novela histórica',
    content: 'Busco recomendaciones de novelas históricas bien documentadas y atrapantes. ¿Alguna sugerencia?',
    author: { id: 'user5', name: 'Lucía Historiadora', avatarUrl: 'https://placehold.co/50x50.png?text=LH' },
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    commentCount: 6,
    likes: 45,
    dislikes: 1,
    genre: 'Histórico',
    category: 'Recomendaciones',
  },
  {
    id: 'post7',
    title: 'El desafío de la página en blanco',
    content: '¿Cómo enfrentan el bloqueo del escritor? Compartamos estrategias para superar ese temido momento.',
    author: { id: 'user2', name: 'Carlos Lector', avatarUrl: 'https://placehold.co/50x50.png?text=CL' },
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1.5 days ago
    commentCount: 3,
    likes: 88,
    dislikes: 0,
    category: 'Ayuda Escritura',
  },
   {
    id: 'post8',
    title: 'Análisis del simbolismo en "El Principito"',
    content: 'Me fascina la profundidad de "El Principito". ¿Qué símbolos les parecen los más significativos y por qué?',
    author: { id: 'user3', name: 'Sofía Creativa', avatarUrl: 'https://placehold.co/50x50.png?text=SC' },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    commentCount: 7,
    likes: 110,
    dislikes: 1,
    genre: 'Fábula',
    category: 'Análisis Literario',
  },
  {
    id: 'post9',
    title: 'Creando personajes memorables',
    content: '¿Cuáles son sus claves para desarrollar personajes que realmente conecten con el lector? Busco consejos para mi próxima novela.',
    imageUrl: 'https://placehold.co/600x300.png',
    author: { id: 'user4', name: 'Marcos Debatiente', avatarUrl: 'https://placehold.co/50x50.png?text=MD' },
    createdAt: new Date(Date.now() - 86400000 * 0.2).toISOString(), // Approx 5 hours ago
    commentCount: 2,
    likes: 30,
    dislikes: 0,
    dataAiHint: 'character development',
    genre: 'Novela',
    category: 'Técnicas de Escritura',
  },
  {
    id: 'post10',
    title: 'La poesía como forma de resistencia',
    content: 'A lo largo de la historia, la poesía ha sido una herramienta poderosa. ¿Conocen ejemplos o autores que usen la poesía de esta manera?',
    author: { id: 'user5', name: 'Lucía Historiadora', avatarUrl: 'https://placehold.co/50x50.png?text=LH' },
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 days ago
    commentCount: 4,
    likes: 72,
    dislikes: 2,
    genre: 'Poesía',
    category: 'Discusión General',
  }
];

export let placeholderComments: Comment[] = [
  { id: 'comment1', postId: 'post1', author: { id: 'user2', name: 'Carlos Lector' }, content: '¡Muy bonito Ana! Me gusta la metáfora de los faros de plata.', createdAt: new Date(Date.now() - 86400000 * 1.9).toISOString() },
  { id: 'comment2', postId: 'post1', author: { id: 'user3', name: 'Sofía Creativa' }, content: 'Transmite mucha calma. Sigue escribiendo!', createdAt: new Date(Date.now() - 86400000 * 1.8).toISOString() },
  { id: 'comment3', postId: 'post1', author: { id: 'user1', name: 'Ana Literata' }, content: '¡Gracias Carlos y Sofía por sus ánimos!', createdAt: new Date(Date.now() - 86400000 * 1.7).toISOString() },
  { id: 'comment4', postId: 'post2', author: { id: 'user1', name: 'Ana Literata' }, content: 'Totalmente de acuerdo, Carlos. La saga de los Buendía es inolvidable.', createdAt: new Date(Date.now() - 86400000 * 0.9).toISOString() },
  { id: 'comment5', postId: 'post2', author: { id: 'user4', name: 'Marcos Debatiente' }, content: 'Es un libro que te marca. Lo leí hace años y aún recuerdo la sensación.', createdAt: new Date(Date.now() - 86400000 * 0.8).toISOString() },
  { id: 'comment6', postId: 'post3', author: { id: 'user2', name: 'Carlos Lector' }, content: 'Sofía, a veces salgo a caminar y observar a la gente. Siempre encuentro alguna historia.', createdAt: new Date(Date.now() - 3600000).toISOString() }, // 1 hour ago
  { id: 'comment7', postId: 'post3', author: { id: 'user1', name: 'Ana Literata' }, content: 'Intenta con disparadores creativos, como una palabra al azar o una imagen.', createdAt: new Date(Date.now() - 7200000).toISOString() }, // 2 hours ago
  { id: 'comment8', postId: 'post4', author: { id: 'user5', name: 'Lucía Historiadora' }, content: 'Creo que ambos formatos coexistirán. El libro físico tiene un encanto especial.', createdAt: new Date(Date.now() - 86400000 * 2.9).toISOString() },
  { id: 'comment9', postId: 'post4', author: { id: 'user1', name: 'Ana Literata' }, content: 'Pienso igual, Lucía. Además, la experiencia táctil del papel es insustituible para muchos.', createdAt: new Date(Date.now() - 86400000 * 2.8).toISOString() },
  { id: 'comment10', postId: 'post5', author: { id: 'user2', name: 'Carlos Lector' }, content: '¡Qué acogedor se ve! El mío es un viejo sillón junto a la ventana.', createdAt: new Date(Date.now() - 86400000 * 0.4).toISOString() },
];

export let placeholderBookComments: BookComment[] = [ 
  { id: 'bcomment1', bookId: '1', author: { id: 'user2', name: 'Carlos Lector' }, content: 'Este libro es fascinante, ¡no pude dejar de leerlo!', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'bcomment2', bookId: '1', author: { id: 'user3', name: 'Sofía Creativa' }, content: 'Me encantó la ambientación y el misterio. Lo recomiendo.', createdAt: new Date(Date.now() - 3600000 * 5).toISOString() }, 
  { id: 'bcomment3', bookId: '2', author: { id: 'user1', name: 'Ana Literata' }, content: 'Una colección de ensayos muy inspiradora para cualquier amante de la lectura.', createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString() }, 
];

export let placeholderImageComments: ImageComment[] = [
  { 
    id: 'imgcomm1', 
    imageId: 'gal1', 
    author: { id: 'user1', name: 'Ana Literata' }, 
    content: '¡Me encanta cómo la luz juega con esta escultura! Muy dinámica.', 
    createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString() 
  },
  { 
    id: 'imgcomm2', 
    imageId: 'gal1', 
    author: { id: 'user2', name: 'Carlos Lector' }, 
    content: 'Las formas son realmente interesantes. Invita a la reflexión.', 
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString() 
  },
  { 
    id: 'imgcomm3', 
    imageId: 'gal2', 
    author: { id: 'user3', name: 'Sofía Creativa' }, 
    content: 'Qué colores tan hermosos. Me transporta a la Provenza.', 
    createdAt: new Date(Date.now() - 86400000 * 0.2).toISOString() 
  },
];


export let placeholderCarouselSlides: CarouselSlide[] = [
  {
    id: 'slide1',
    imageUrl: 'https://placehold.co/1200x600.png',
    title: 'Explora Nuevos Mundos Literarios',
    description: 'Descubre obras fascinantes y autores emergentes en nuestra comunidad.',
    dataAiHint: 'library books',
  },
  {
    id: 'slide2',
    imageUrl: 'https://placehold.co/1200x600.png',
    title: 'Comparte Tus Propias Creaciones',
    description: 'Publica tus escritos, poemas e ideas en nuestro foro interactivo.',
    linkUrl: '/foro/crear',
    dataAiHint: 'writing desk',
  },
  {
    id: 'slide3',
    imageUrl: 'https://placehold.co/1200x600.png',
    title: 'Conecta con Otros Amantes de las Letras',
    description: 'Participa en debates, ofrece retroalimentación y haz nuevos amigos.',
    linkUrl: '/foro',
    dataAiHint: 'community discussion',
  },
];

export let placeholderCourses: Course[] = [
  {
    id: 'curso1',
    title: 'Escritura Creativa: Desbloquea tu Potencial',
    description: 'Un curso completo para desarrollar tus habilidades narrativas, crear personajes memorables y encontrar tu voz única como escritor.',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'creative writing',
    hotmartLink: 'https://hotmart.com/es/club/tu-espacio/products/000000/000000/000001', 
    tags: ['Escritura', 'Creatividad', 'Narrativa'],
  },
  {
    id: 'curso2',
    title: 'El Arte de la Novela: De la Idea a la Publicación',
    description: 'Aprende el proceso paso a paso para planificar, escribir y revisar una novela, con consejos para la publicación.',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'novel writing',
    hotmartLink: 'https://hotmart.com/es/club/tu-espacio/products/000000/000000/000002', 
    tags: ['Novela', 'Escritura', 'Publicación'],
  },
  {
    id: 'curso3',
    title: 'Poesía para el Alma: Expresión y Técnica',
    description: 'Explora diferentes formas poéticas, encuentra inspiración en lo cotidiano y aprende a pulir tus versos para conmover al lector.',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'poetry workshop',
    hotmartLink: 'https://hotmart.com/es/club/tu-espacio/products/000000/000000/000003', 
    tags: ['Poesía', 'Expresión', 'Técnica Literaria'],
  }
];

export let placeholderGameDocuments: GameDocument[] = [
  {
    id: 'game1',
    title: 'Aventura Textual: El Misterio del Faro',
    description: 'Un emocionante juego de aventura basado en texto donde debes resolver acertijos para descubrir los secretos de un faro abandonado.',
    longDescription: 'Sumérgete en "El Misterio del Faro", una aventura interactiva que te transportará a una isla remota azotada por la tormenta. Como investigador de lo paranormal, has sido llamado para explorar un antiguo faro del que se cuentan extrañas leyendas. Resuelve enigmas, examina pistas y toma decisiones que determinarán tu destino. ¿Descubrirás la verdad oculta en sus muros o te convertirás en otra víctima de sus secretos? Este PDF interactivo te guiará a través de la narrativa, ofreciendo múltiples caminos y finales.',
    coverImageUrl: 'https://placehold.co/400x300.png',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfFileName: 'misterio_faro_aventura.pdf',
    dataAiHint: 'lighthouse mystery',
    commentCount: 2,
  },
  {
    id: 'game2',
    title: 'Guía de Creación de Mundos Fantásticos',
    description: 'Un PDF con ejercicios y plantillas para ayudarte a construir mundos de fantasía detallados y coherentes para tus historias o juegos de rol.',
    longDescription: '¿Siempre has soñado con crear tu propio universo de fantasía? Esta guía es el punto de partida perfecto. A través de una serie de capítulos estructurados, aprenderás a diseñar la geografía, la historia, las culturas, las criaturas y los sistemas de magia de tu mundo. Incluye plantillas detalladas, ejercicios prácticos y consejos de escritores experimentados para dar vida a tus ideas más ambiciosas. Ideal para narradores, escritores de ficción y directores de juego de rol.',
    coverImageUrl: 'https://placehold.co/400x300.png',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 
    pdfFileName: 'guia_mundos_fantasticos.pdf',
    dataAiHint: 'fantasy world',
    commentCount: 1,
  },
  {
    id: 'game3',
    title: 'Desafío de Microrelatos Semanal',
    description: 'Descarga las bases y el tema para el desafío de microrelatos de esta semana. ¡Pon a prueba tu creatividad!',
    longDescription: 'Participa en nuestro Desafío de Microrelatos Semanal y pon a prueba tu capacidad de síntesis y creatividad. Cada semana, proponemos un nuevo tema o una palabra clave como disparador. Este PDF contiene las bases del desafío actual, el tema específico y algunos consejos para escribir microficción impactante. ¡Anímate a compartir tu creación en nuestro foro y recibe retroalimentación de la comunidad!',
    coverImageUrl: 'https://placehold.co/400x300.png',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 
    pdfFileName: 'desafio_microrelatos.pdf',
    dataAiHint: 'writing challenge',
    commentCount: 0,
  },
];

export let placeholderGameDocumentComments: GameDocumentComment[] = [
  { 
    id: 'gamedoccomm1', 
    documentId: 'game1', 
    author: { id: 'user1', name: 'Ana Literata' }, 
    content: '¡Qué intrigante el juego del faro! Me tuvo enganchada hasta el final.', 
    createdAt: new Date(Date.now() - 86400000 * 0.3).toISOString() 
  },
  { 
    id: 'gamedoccomm2', 
    documentId: 'game1', 
    author: { id: 'user2', name: 'Carlos Lector' }, 
    content: 'Me perdí un poco en los acertijos del segundo capítulo, pero muy bueno.', 
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString() 
  },
  { 
    id: 'gamedoccomm3', 
    documentId: 'game2', 
    author: { id: 'user3', name: 'Sofía Creativa' }, 
    content: 'La guía de mundos fantásticos es súper útil. Ya estoy aplicando las plantillas.', 
    createdAt: new Date(Date.now() - 86400000 * 0.1).toISOString() 
  },
];

export let placeholderConferences: Conference[] = [
  {
    id: 'conf1',
    title: 'El Futuro de la Narrativa Digital',
    description: 'Una charla explorando cómo las nuevas tecnologías están transformando la forma en que contamos y experimentamos historias.',
    videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_1', // Reemplaza VIDEO_ID_1 con un ID real de YouTube para probar
    thumbnailUrl: 'https://placehold.co/600x338.png', // 16:9 aspect ratio
    dataAiHint: 'digital narrative future',
    date: '2024-06-15',
  },
  {
    id: 'conf2',
    title: 'La Psicología de los Personajes de Ficción',
    description: 'Un análisis profundo sobre cómo construir personajes complejos y creíbles que resuenen con la audiencia.',
    videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_2', // Reemplaza VIDEO_ID_2
    thumbnailUrl: 'https://placehold.co/600x338.png',
    dataAiHint: 'character psychology fiction',
    date: '2024-05-20',
  },
  {
    id: 'conf3',
    title: 'Técnicas Avanzadas de Storytelling Interactivo',
    description: 'Descubre métodos innovadores para involucrar a tu audiencia y permitirles influir en el desarrollo de la historia.',
    videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_3', // Reemplaza VIDEO_ID_3
    thumbnailUrl: 'https://placehold.co/600x338.png',
    dataAiHint: 'interactive storytelling techniques',
    date: '2024-04-10',
  },
];


// Placeholder function to simulate fetching data
export const simulateFetch = <T>(data: T, delay: number = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};
