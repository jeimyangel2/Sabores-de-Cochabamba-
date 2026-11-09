-- ========================================================
-- SABORES DE COCHABAMBA - DATOS INICIALES DE EJEMPLO (SEEDS)
-- ========================================================

USE `sabores_cochabamba`;

-- 1. Inserción de Municipios
INSERT INTO `municipios` (
  `id`, `nombre`, `descripcion`, `imagen`, `descripcion_cultural`, 
  `lugar_turistico_nombre`, `lugar_turistico_descripcion`, 
  `lugar_turistico_imagen`, `lugar_turistico_video`
) VALUES
(
  1, 
  'Cercado (Cochabamba)', 
  'El corazón del valle cochabambino y capital gastronómica de Bolivia. Famoso por su clima primaveral y su legendaria tradición culinaria de porciones generosas.',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  'Cuna del mestizaje culinario andino-valluno, donde las chicherías tradicionales y los mercados populares como La Cancha forjaron la identidad del buen comer cochabambino.',
  'Cristo de la Concordia', 
  'Monumento colosal situado en la cima del cerro San Pedro, con más de 40 metros de altura, que ofrece una vista panorámica inigualable de todo el valle.',
  'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80',
  'https://www.w3schools.com/html/mov_bbb.mp4'
),
(
  2, 
  'Quillacollo', 
  'Segunda ciudad más importante del departamento, centro de devoción mariana y rica en tradiciones agrícolas de maíz y tubérculos.',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  'Hogar de la festividad de la Virgen de Urkupiña, donde miles de peregrinos comparten comidas rituales y platos típicos como el lechón y la jak\'a lawa en comunidad.',
  'Templo de San Ildefonso y Calvario de Urkupiña', 
  'Santuario colonial y cerro sagrado donde convergen la fe católica y los ritos andinos de agradecimiento a la Pachamama.',
  'https://images.unsplash.com/photo-1548625361-19597793d4fa?auto=format&fit=crop&w=800&q=80',
  NULL
),
(
  3, 
  'Tiquipaya', 
  'Conocida como la Capital de las Flores, caracterizada por sus manantiales, huertos andinos y microclima privilegiado a los pies del Tunari.',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'Tradición forjada en la producción florícola y lechera, con ferias gastronómicas que celebran la trucha fresca de altura y los quesos artesanales.',
  'Reserva de Vida Silvestre y Cordillera del Tunari', 
  'Majestuoso macizo montañoso con senderos ecológicos, cascadas cristalinas y bosques nativos de queñua.',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  NULL
),
(
  4, 
  'Sacaba', 
  'Tradicional villa valluna y tierra del chicharrón crujiente, rodeada de fértiles campos y valles interandinos.',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
  'Pueblo de arraigadas costumbres donde los domingos de chicharrón con chicha kulli son un patrimonio vivo de encuentro familiar.',
  'Parque Cretácico y Mirador de Chiñata', 
  'Complejo recreativo y mirador con réplicas paleontológicas y una vista abierta hacia los valles productivos.',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
  NULL
),
(
  5, 
  'Tarata', 
  'La Ciudad Colonial y Cuna de Presidentes, destacada por sus callejuelas empedradas, casonas históricas y su famoso chorizo.',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  'Custodia de recetas virreinales intactas, conventos franciscanos y alfarería tradicional de barro cocido.',
  'Convento Franciscano de San José y Plaza Principal', 
  'Joyas arquitectónicas virreinales que conservan reliquias históricas de los siglos XVIII y XIX con claustros y biblioteca colonial.',
  NULL,
  NULL
),
(
  6, 
  'Punata', 
  'La Perla del Valle Alto, reconocida por sus ferias ganaderas, el rosquete dulce y los chicharrones de cuye.',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  'Zona de gran orgullo agrícola donde las recetas familiares se transmiten por generaciones alrededor de los hornos de leña.',
  'Templo San Juan Bautista y Casonas Coloniales', 
  'Monumento nacional de imponente torre campanario y retablos barrocos tallados en cedro.',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  NULL
),
(
  7, 
  'Cliza', 
  'Población emblemática del Valle Alto, afamada por sus fiestas patronales y su especialidad en pichones tiernos asados a la brasa.',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'Corazón maicero y epicentro de ferias tradicionales donde la comida al rescoldo de brasas es un arte.',
  'Plaza 21 de Septiembre y Templo del Carmen', 
  'Punto neurálgico histórico donde se reúnen artesanos y cocineras tradicionales en los días de feria.',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  NULL
),
(
  8, 
  'Aiquile', 
  'Capital Internacional del Charango y puerta al Cono Sur cochabambino, con una riqueza musical y gastronómica única.',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
  'Fusión de tradición quechua y valluna con guisos especiados y ceremoniales como el emblemático Uchuku.',
  'Museo Arqueológico y del Charango', 
  'Centro cultural que resguarda la colección más grande del instrumento de cuerda representativo de la música boliviana.',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
  NULL
);

-- 2. Inserción de Platos Típicos
INSERT INTO `platos` (
  `id`, `nombre`, `descripcion`, `municipio_id`, 
  `imagen_principal`, `ingredientes`, `preparacion`, 
  `imagen_preparacion`, `video_preparacion`, `destacado`
) VALUES
(
  1,
  'Pique Macho',
  'El plato bandera y emblema máximo de Cochabamba. Trozos jugosos de lomo de res salteados con salchichas, papas fritas crocantes, huevo duro, cebolla, tomate y picantes rodajas de locoto fresco.',
  1,
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  '1 kg de lomo o pulpa de res tierna cortada en dados\n4 salchichas de res o viena cortadas en rodajas\n6 papas imillas medianas cortadas en bastones gruesos\n4 huevos cocidos duros cortados en cuartos\n3 tomates medianos en rodajas o gajos\n2 cebollas moradas medianas cortadas en pluma gruesa\n3 locotos verdes y rojos cortados en aros finos\n4 dientes de ajo picados finamente\n1/2 taza de cerveza negra o rubia\n2 cucharadas de salsa soya\nSal, pimienta molida, comino al gusto\nAceite para freír',
  '1. Pelar y cortar las papas en bastones. Freírlas en abundante aceite caliente hasta que queden doradas y crocantes por fuera y suaves por dentro. Escurrir y reservar con una pizca de sal.\n2. En una sartén amplia o perol caliente, sellar la carne sazonada con ajo, sal, comino y pimienta a fuego vivo. Agregar las salchichas y saltear durante 3 minutos.\n3. Añadir el toque de salsa soya y la cerveza para levantar los fondos de cocción creando ese jugo característico.\n4. Incorporar la cebolla, el tomate y una porción de locoto salteando apenas 1 minuto para conservar su textura crocante.\n5. Montar en una fuente grande una base de papas fritas calientes, cubrir con la carne salteada y su jugo caliente, y coronar con cuartos de huevo duro, aceitunas y abundantes aros de locoto.',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  NULL,
  1
),
(
  2,
  'Silpancho',
  'Exquisito y contundente plato cochabambino compuesto por una fina milanesa de carne apanada que cubre todo el plato, servida sobre una cama de arroz blanco y papas doradas, coronada con dos huevos fritos y ensalada fresca de sarsa con locoto.',
  1,
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
  '600 g de pulpa de carne de res sin grasa cortada en filetes\n1 taza de pan molido o galleta molida\n4 papas hervidas cortadas en rodajas y doradas\n2 tazas de arroz blanco cocido\n4 huevos frescos\n2 tomates picados en cubitos (brunoise)\n1 cebolla morada picada en cubitos\n2 locotos verdes picados finamente\nAceite, sal y comino al gusto',
  '1. Sobre una tabla de madera o mortero de piedra (batán), extender el filete de carne cubierto con abundante pan molido.\n2. Golpear vigorosamente con un combo o mazo de madera hasta que la carne quede sumamente fina, amplia y tierna, integrando el pan molido en sus fibras.\n3. En una sartén con aceite caliente, freír las rodajas de papa previamente cocidas hasta que estén crujientes y doradas.\n4. Freír la carne estirada rápidamente (1 a 2 minutos por lado) para que no se seque. Paralelamente freír los huevos a la inglesa conservando la yema tierna.\n5. Preparar la sarsa mezclando el tomate, cebolla, locoto picado, un chorrito de vinagre, aceite y sal.\n6. Servir primero el arroz blanco, rodear con las papas doradas, colocar la carne extendida encima, coronar con los huevos fritos y verter la sarsa fresca por encima.',
  NULL,
  NULL,
  1
),
(
  3,
  'Chicharrón de Cerdo Sacabeño',
  'Trozos seleccionados de carne y costilla de cerdo cocinados pacientemente en su propia manteca en peroles de cobre, servidos con mote de maíz tierno, pataskha, papa con cáscara (kawi) y llajwa picante hecha en batán.',
  4,
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  '2 kg de costilla y pierna de cerdo cortada en presas medianas\n1/2 taza de chicha de maíz o cerveza rubia\n6 dientes de ajo molidos\n1 cucharadita de comino molido y pimienta negra\n4 tazas de mote de maíz blanco cocido\n6 papas cocidas con cáscara (papas kawi)\nSal al gusto\nPara la llajwa: 3 locotos verdes, 2 tomates frescos, ramitas de quirquiña o suyku, sal',
  '1. En un perol grande con agua justa, colocar los trozos de carne con sal, ajo molido y comino. Hervir a fuego medio hasta que el agua se evapore por completo y la carne quede tierna.\n2. Cuando el agua se agote, la carne comenzará a soltar su propia manteca. Dejar que se fría lentamente en su propia grasa revolviendo constantemente para un dorado parejo y crujiente por fuera.\n3. Justo antes de retirar, agregar un chorro de chicha de maíz para aromatizar y dar ese toque valluno único.\n4. Servir de inmediato bien caliente sobre abundante mote de maíz blanco y papas kawi, acompañado de una llajwa fresca molida en batán de piedra.',
  NULL,
  NULL,
  1
),
(
  4,
  'Charque de Llama con Quesillo',
  'Finas hilachas de carne de llama deshidratada al sol y tostada hasta obtener una textura crujiente y liviana, servida con mote blanco, huevo duro, papa hervida y láminas de quesillo fresco cochabambino.',
  1,
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  '500 g de charque de llama de primera calidad\n4 tazas de maíz blanco desgranado y cocido (mote)\n4 papas imillas medianas cocidas\n4 porciones de quesillo valluno fresco\n4 huevos cocidos\nAceite para freír\nLlajwa tradicional',
  '1. Lavar bien el charque y remojarlo en agua tibia para desalarlo moderadamente.\n2. Cocinar el charque en agua hasta que esté tierno. Escurrir bien y golpear en el batán para aflojar las fibras.\n3. Desmenuzar manualmente la carne en hebras muy finas.\n4. Calentar un sartén con aceite y freír las hebras de charque hasta que adquieran un color dorado y textura crocante.\n5. Servir el mote caliente con las papas, colocar encima el charque crocante y acompañar con rodajas de quesillo fresco y huevo duro.',
  NULL,
  NULL,
  1
),
(
  5,
  'Jak\'a Lawa de Choclo',
  'Reconfortante crema o sopa espesa elaborada con choclos tiernos recién molidos en batán, costillitas de res o cerdo, verduras frescas, ají amarillo y ramitas de hierbabuena.',
  2,
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  '8 choclos tiernos desgranados y molidos en batán con un toque de agua\n700 g de costillitas de res o cerdo\n1 taza de arvejas frescas peladas\n1 zanahoria cortada en dados pequeños\n1 cebolla picada y dorada con ajo y ají amarillo molido\n4 papas medianas cortadas en cubos\nCaldo concentrado de carne\nRamitas de hierbabuena fresca y sal al gusto',
  '1. En una olla de barro o fondo grueso, hervir las costillitas en agua sazonada con sal y hierbas hasta formar un caldo sabroso y tierno.\n2. En sartén aparte, sofreír la cebolla, ajo y ají amarillo hasta que esté fragante y bien cocido (ahogado).\n3. Agregar el ahogado, las arvejas, zanahoria y papas al caldo hirviendo.\n4. Añadir lentamente el choclo recién molido revolviendo enérgicamente con cuchara de palo para evitar que se formen grumos o se pegue al fondo.\n5. Dejar espesar a fuego lento durante 20 minutos hasta que tome la consistencia sedosa tradicional. Servir bien caliente espolvoreado con perejil o hierbabuena fresca.',
  NULL,
  NULL,
  1
),
(
  6,
  'Api Morado con Pastel de Queso',
  'Bebida caliente ancestral a base de maíz morado andino perfumado con canela, clavo de olor y cáscara de naranja, servido junto a un pastel frito gigante, esponjoso y relleno de abundante queso derretido.',
  1,
  'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
  '2 tazas de harina de maíz morado\n8 tazas de agua\n2 ramitas gruesas de canela\n4 clavos de olor\nCáscara de 1 naranja\nAzúcar al gusto y jugo de 1 limón\nPara el pastel: 3 tazas de harina de trigo, 1 cucharadita de polvo de hornear, 1 pizca de sal, manteca tibia, agua tibia y 400 g de queso criollo salado rallado.',
  '1. Para el Api: En una olla hervir el agua con la canela, el clavo y la cáscara de naranja durante 15 minutos para extraer los aromas.\n2. Disolver la harina de maíz morado en dos tazas de agua fría e incorporarla al agua hirviendo colada, batiendo continuamente.\n3. Cocinar a fuego lento durante 25 minutos hasta que espese y adquiera brillo. Añadir azúcar y jugo de limón al final.\n4. Para el Pastel: Formar una masa suave con la harina, polvo de hornear, sal, manteca y agua tibia. Dejar reposar 15 minutos.\n5. Estirar porciones en discos muy finos, rellenar con abundante queso, repulgar los bordes herméticamente.\n6. Freír en aceite bien caliente bañando la superficie con espumadera para que infle y quede dorado. Espolvorear con azúcar impalpable y servir de inmediato con el api humeante.',
  NULL,
  NULL,
  1
),
(
  7,
  'Uchuku Aiquileño',
  'Plato festivo ceremonial típico del municipio de Aiquile. Combina tres carnes (res, lengua y pollo o cordero) bañadas en una salsa de ají colorado especial, acompañadas de arroz blanco, chuño pasi, papa imilla y pastel de papa.',
  8,
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  '1 kg de carne de res (pecho o falda)\n1 lengua de res cocida y pelada\n4 presas de pollo criollo\nAjí colorado despepitado, tostado y molido en batán\nChuño negro remojado, pellizcado y cocido (pasi)\nPapas imillas cocidas\nArroz graneado\nQuesillo y huevo para el pastel de papa\nCebolla, comino, ajo y sal',
  '1. Cocinar por separado las carnes en caldos aromatizados hasta que estén sumamente tiernas.\n2. Elaborar la salsa de Uchuku cociendo el ají colorado molido con cebolla dorada, ajo, comino y caldo de las carnes a fuego lento durante 40 minutos para lograr un color rojo intenso y sabor profundo.\n3. Preparar el chuño pasi salteándolo con huevo y queso desmenuzado.\n4. Al momento de servir, acomodar en un plato amplio una porción de arroz, chuño pasi, papas y las tres carnes troceadas.\n5. Bañar generosamente las carnes con la salsa de ají caliente y decorar con perejil fresco picado.',
  NULL,
  NULL,
  0
),
(
  8,
  'Chorizo Tarateño Tradicional',
  'Embutido artesanal de carne de cerdo finamente sazonada con hierbabuena, comino, ají y vinagre de chicha, servido con mote de habas, papas cocidas y ensalada criolla.',
  5,
  'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80',
  '1 kg de carne de cerdo picada a cuchillo con algo de grasa\nTripa de cerdo limpia para embutir\nHierbabuena fresca picada\nComino molido, pimienta dulce y ajo triturado\nAjí amarillo tostado\nChicha o vinagre suave\nMote de habas y papas cocidas para acompañar',
  '1. Mezclar la carne de cerdo con las especias, hierbabuena, sal y el toque de chicha hasta amalgamar perfectamente los sabores.\n2. Embutir la mezcla en las tripas limpias formando chorizos individuales atados con hilo de algodón.\n3. Hervir los chorizos en un poco de agua con especias durante 15 minutos.\n4. Pasarlos a una sartén con poca grasa para dorarlos por fuera hasta que queden caramelizados y crocantes.\n5. Servir acompañados de papas cocidas, ensalada de cebolla y tomate, y mote tierno de habas.',
  NULL,
  NULL,
  0
);

-- ========================================================
-- 3. Inserción de Administradores
-- Usuario: edwin | Contraseña en texto plano: anai1234
-- Usuario: admin | Contraseña en texto plano: AdminCochabamba2026!
-- Hash bcrypt seguro con costo 10
-- ========================================================
INSERT INTO `administradores` (
  `id`, `nombre`, `usuario`, `password_hash`, `rol`, `activo`
) VALUES (
  1,
  'Edwin',
  'edwin',
  '$2b$10$6KcOffZ096erfD9H8JxDCO4MWlrS3K5tijyibeQ94NJ7au1KI6..i',
  'administrador',
  1
),
(
  2,
  'Administrador General',
  'admin',
  '$2b$10$MrI0S.ZntAvMgWOQ5IRzhOHXmz36.Qhdp0ydsxAOIrGAnBR2W0lKO',
  'administrador',
  1
) ON DUPLICATE KEY UPDATE `password_hash` = VALUES(`password_hash`), `nombre` = VALUES(`nombre`), `activo` = 1;

-- ========================================================
-- 4. Configuración Inicial del Banner y Platillo Insignia
-- ========================================================
INSERT INTO `configuracion_hero` (
  `id`,
  `banner_imagen`,
  `banner_titulo`,
  `banner_subtitulo`,
  `banner_descripcion`,
  `insignia_titulo`,
  `insignia_subtitulo`,
  `insignia_imagen`,
  `insignia_descripcion`,
  `insignia_plato_id`
) VALUES (
  1,
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
  'Sabores de Cochabamba',
  'Tierra bendecida por su cocina y sus tradiciones',
  'Descubre la riqueza culinaria del valle cochabambino. Una iniciativa dedicada a documentar, preservar y compartir las recetas ancestrales y las técnicas que han pasado de generación en generación.',
  'Pique Macho',
  'El plato bandera que nos identifica',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  'Carne de res, salchichas, papas fritas, huevo y locoto',
  2
) ON DUPLICATE KEY UPDATE `id` = 1;



