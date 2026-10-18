// 行程資料來源：「2027OCT挪威峽灣 羅浮敦群島 極光 13天.docx」
// 必看／必吃／必買與素食店家為補充建議；店家營業狀況與菜單會變動，出發前需再次確認。

export const trip = {
  title: "極光秘境・挪威峽灣・羅浮敦 13 日",
  subtitle: "三夜極光機會・雙景觀鐵道・雙峽灣巡禮・傳統海濱漁屋",
  departure: "2027/10/05",
  departureDate: "2027-10-05",
  returnDate: "2027/10/17",
  days: 13,
  capacity: 16,
  diet: "全程奶素",
  type: "私人訂製團",
  gateway: "高雄小港機場出發（泰國航空經曼谷轉機）",
};

// 第 N 天的日期，例如 dayDate(1) → "10/05（二）"
export function dayDate(day: number) {
  const date = new Date(`${trip.departureDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + day - 1);
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${mm}/${dd}（${"日一二三四五六"[date.getUTCDay()]}）`;
}

export const features = [
  { icon: "🌌", title: "北極圈三夜極光", desc: "雷訥、斯沃爾韋爾、瑞典基律納連續三晚住宿高緯度地區，增加與極光相遇的機會。" },
  { icon: "⛴️", title: "雙峽灣巡禮", desc: "「峽灣之王」松恩峽灣遊船，以及果園環繞、被稱為「女人峽灣」的哈丹格峽灣。" },
  { icon: "🚂", title: "雙景觀鐵道", desc: "弗萊姆高山景觀鐵道，加上從挪威納爾維克跨境到瑞典基律納的北極圈景觀鐵道。" },
  { icon: "🏝️", title: "羅浮敦深度三天兩夜", desc: "奧鎮、雷訥、哈姆諾伊、亨寧斯韋爾、斯沃爾韋爾，走訪北國最美漁村。" },
  { icon: "🏠", title: "傳統海濱漁屋 Rorbuer", desc: "入住昔日漁民的紅色木造漁屋，依偎海灣、遠眺山峰，住宿本身就是風景。" },
  { icon: "🏘️", title: "卑爾根世界遺產", desc: "漫遊漢薩同盟時期留下的布呂根彩色木屋群，感受挪威海港文化。" },
  { icon: "🦌", title: "瑞典拉普蘭", desc: "深入北極圈城市基律納，體驗北方森林、高原與湖泊交織的荒野風情。" },
  { icon: "👑", title: "雙首都文化巡禮", desc: "奧斯陸滑雪跳台，斯德哥爾摩瓦薩號、老城、王宮、市政廳與東城食品市場。" },
];

export type VegSpot = {
  name: string;
  area: string;
  type: "全素" | "素食" | "素食友善";
  note: string;
  address: string; // 英文地址，用來產生 Google 地圖連結
  website?: string;
  hours: string;
};

export type Spot = {
  name: string;
  desc: string;
  hours?: string;
  website?: string;
};

export function mapLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export type Day = {
  day: number;
  title: string;
  route: string;
  flight?: string;
  image?: string;
  imageAlt?: string;
  gallery?: { src: string; alt: string }[];
  aurora?: boolean;
  intro: string;
  spots: Spot[];
  mustSee: string[];
  mustEat: string[];
  mustBuy: string[];
  veg: VegSpot[];
  vegNote?: string;
  warning?: string;
  meals: { breakfast: string; lunch: string; dinner: string };
  hotel: string;
};

export const days: Day[] = [
  {
    day: 1,
    title: "高雄出發・飛向北歐",
    route: "高雄 ✈ 曼谷",
    flight: "TG631 KHH/BKK 17:15 – 19:55",
    intro: "集合於高雄小港機場，由專人辦理出境手續，經曼谷轉機飛往北歐地球頂，班機於隔日抵達。",
    spots: [],
    mustSee: [],
    mustEat: [],
    mustBuy: [],
    veg: [],
    vegNote: "航空餐請於訂位時預訂「奶素餐（Lacto-Vegetarian Meal）」，並於報到時再次確認。",
    meals: { breakfast: "—", lunch: "—", dinner: "機上奶素餐" },
    hotel: "豪華客機",
  },
  {
    day: 2,
    title: "抵達挪威首都奧斯陸",
    route: "曼谷 ✈ 奧斯陸",
    flight: "TG954 BKK/OSL 00:05 – 07:25",
    image: "/images/oslo.jpg",
    imageAlt: "奧斯陸峽灣畔的奧斯陸歌劇院夜景",
    intro: "奧斯陸位於奧斯陸峽灣內部，1294 年起成為挪威首都，也是挪威人口最多的城市。",
    spots: [
      {
        name: "維京船博物館", hours: "閉館整修中，將以「維京時代博物館」重新開放，預計 2027 年中至年底，確切日期未公布（10/06 可能尚未開放）", website: "https://www.khm.uio.no/english/visit-us/viking-ship-museum/",
        desc: "展示在奧斯陸峽灣附近出土的三艘維京船，以及精美木雕與織品，是全球保存最完整的維京文物之一。",
      },
    ],
    mustSee: ["維京船與出土木雕、織品", "奧斯陸峽灣港灣景色"],
    mustEat: ["挪威棕起司 Brunost 配薄脆餅：以乳清熬煮的焦糖色起司，奶素可食"],
    mustBuy: ["Freia 牛奶巧克力：挪威國民巧克力品牌"],
    veg: [
      { name: "Nordvegan", area: "奧斯陸市中心（Kristian IVs gate）", type: "全素", note: "奧斯陸知名全素餐廳，菜單每週輪替，旺季建議訂位。", address: "Kristian IVs gate 15B, 0162 Oslo, Norway", website: "https://www.nordvegan.no", hours: "週一至週四 11:00–20:00、週五 11:00–21:00、週六 11:30–21:00、週日 12:00–20:00" },
      { name: "Dirty V Oslo", area: "奧斯陸 Torggata（近 Grünerløkka）", type: "全素", note: "Dirty Vegan 的奧斯陸分店，全素漢堡與薯條；原列的 Funky Fresh Foods 已歇業。", address: "Torggata 23, 0183 Oslo, Norway", website: "https://dirtyv.no", hours: "週一至週四 12:00–22:00、週五至週六 12:00–23:00、週日 13:00–23:00" },
    ],
    warning:
      "維京船博物館自 2020 年代初起閉館整修，預計 2027 年以「維京時代博物館」重新開放，但正式開幕日期尚未公布。出發前需確認是否開放，並準備替代景點。",
    meals: { breakfast: "機上奶素餐", lunch: "中式素食六菜一湯", dinner: "北歐風味奶素餐" },
    hotel: "RADISSON BLU／SCANDIC HOTEL／THON HOTEL 或四星同等級",
  },
  {
    day: 3,
    title: "霍爾門考倫滑雪跳台・前往峽灣區",
    route: "奧斯陸 → 霍爾門考倫 → 峽灣區",
    image: "/images/holmenkollen.jpg",
    imageAlt: "霍爾門考倫滑雪跳台",
    intro: "霍爾門考倫是挪威百年滑雪勝地與歷史地標，挪威各大滑雪比賽與冬季奧運都曾在此舉辦。",
    spots: [
      {
        name: "霍爾門考倫滑雪跳台（入內參觀）", hours: "10–12 月每日 10:00–16:00（博物館與跳台同時段）", website: "https://holmenkollen.com/en/apningstider/",
        desc: "由滑雪博物館與滑雪跳台兩部分組成。博物館 1923 年開放，是世界上最古老的滑雪博物館，跳台頂端可俯瞰奧斯陸市區與峽灣。",
      },
    ],
    mustSee: ["跳台頂端觀景台俯瞰奧斯陸峽灣", "滑雪博物館：四千年滑雪歷史與極地探險文物"],
    mustEat: ["挪威薄餅 Lefse：以馬鈴薯與奶油製成，部分配方含蛋，請先詢問"],
    mustBuy: ["挪威傳統花紋毛衣與毛帽", "滑雪博物館紀念品"],
    veg: [],
    vegNote: "今日午、晚餐於餐廳與飯店用餐，請旅行社提前告知奶素需求。",
    meals: { breakfast: "飯店早餐", lunch: "北歐風味奶素餐", dinner: "飯店主廚奶素料理" },
    hotel: "THON HOTEL AL／SKISTAR LODGE HEMSEDAL 或四星同等級",
  },
  {
    day: 4,
    title: "弗萊姆高山景觀鐵道",
    route: "峽灣區 → 弗萊姆 ⇄ 米達爾",
    image: "/images/flam.jpg",
    imageAlt: "停靠在弗萊姆車站的高山景觀火車",
    intro:
      "弗萊姆的挪威文原意為「高山間的平地」，坐落在峽灣山谷之間，是松恩峽灣的重要旅遊停點，車站、碼頭、餐廳與紀念品店一應俱全。",
    spots: [
      {
        name: "弗萊姆高山景觀鐵道（入內參觀）", hours: "全年行駛，秋季每日約 5–7 班往返弗萊姆與米達爾，單程約 1 小時；車票限搭指定班次，班表需再確認", website: "https://www.norwaysbest.com/flamsbana",
        desc: "往返弗萊姆與米達爾，被譽為挪威高山鐵路之冠。列車穿越隧道、忽高忽低上山下谷，沿途瀑布與山谷景致千變萬化。",
      },
    ],
    mustSee: ["沿途高山瀑布與深谷景觀", "米達爾高山車站周邊雪景", "弗萊姆峽灣小鎮與碼頭"],
    mustEat: ["Ægir 啤酒屋的素食料理：菜單有標示可做成素食的選項"],
    mustBuy: ["弗萊姆鐵道博物館與車站紀念品"],
    veg: [
      { name: "Ægir BrewPub", area: "弗萊姆車站旁", type: "素食友善", note: "維京長屋風格啤酒屋，菜單有標示素食／純素選項。", address: "A-Feltvegen 19, 5743 Flåm, Norway", website: "https://www.flamsbrygga.no", hours: "全年營業；10–4 月約 17:00 起供應晚餐（午餐是否營業需再確認）" },
      { name: "Flåmsbrygga 餐廳／Fjord Bistro", area: "弗萊姆碼頭", type: "素食友善", note: "有鷹嘴豆漢堡等素食餐點。Flåmstova 晚餐僅夏季供應，10 月可改到同一庭院、全年營業的 Fjord Bistro。", address: "A-Feltvegen 19, 5743 Flåm, Norway", website: "https://www.flamsbrygga.no", hours: "Flåmstova 晚餐僅夏季；Fjord Bistro 全年供應午、晚餐（時間未公布，需再確認）" },
      { name: "Fretheim Hotel Arven 餐廳", area: "弗萊姆", type: "素食友善", note: "有鷹嘴豆咖哩、烤蔬菜等素食選擇，建議訂位（+47 57 63 63 00）。", address: "Fretheim Hotel, Nedre Brekkevegen 31, 5743 Flåm, Norway", website: "https://www.norwaysbest.com/en/flam/food-and-drinks/restaurant-arven", hours: "全年營業；晚餐 18:30–21:00，午餐僅接受團體預約 11:30–14:30" },
    ],
    meals: { breakfast: "飯店早餐", lunch: "北歐風味奶素餐", dinner: "飯店主廚奶素料理" },
    hotel: "VESTERLAND FERIEPARK 或同等級",
  },
  {
    day: 5,
    title: "松恩峽灣遊船・海港城市卑爾根",
    route: "弗萊姆 → 松恩峽灣 → 卑爾根",
    image: "/images/sognefjord.jpg",
    imageAlt: "松恩峽灣兩岸的陡峭山壁",
    gallery: [{ src: "/images/bryggen.jpg", alt: "卑爾根布呂根的彩色木屋" }],
    intro: "松恩峽灣號稱「峽灣之王」，全長 204 公里、最深處達 1,308 公尺，是挪威最具人氣的峽灣。",
    spots: [
      {
        name: "松恩峽灣遊船", hours: "全年行駛，弗萊姆－古德凡根「納柔依峽灣遊船」每日數班、單程約 2 小時；弗萊姆－卑爾根快船 10 月可能已停航，需再確認", website: "https://www.norwaysbest.com",
        desc: "在平靜如鏡的水面航行，兩岸山群拔地而起，瀑布在陽光下閃閃發光，是挪威不可錯過的美景。",
      },
      {
        name: "布呂根木屋群", hours: "戶外街區 24 小時開放；布呂根博物館 10 月約每日 10:00–15:00、漢薩博物館約 10:00–18:00（兩館時間來源不一，需再確認）", website: "https://bymuseet.no/opening-hours/?lang=en",
        desc: "中世紀時卑爾根是北歐最大的港口與貿易中心。現存 62 棟木造房舍多為 18 世紀後重建，1979 年列入世界文化遺產。",
      },
      {
        name: "卑爾根魚市場", hours: "室內魚市場 Mathallen 每日約 09:00–21:30，各攤位時間不同；戶外攤位僅夏季營業，10 月多已收攤", website: "https://en.visitbergen.com/things-to-do/shopping/fish-market",
        desc: "位於港口南岸，與布呂根隔內港相望。素食團員可單純逛逛感受港口氣氛。",
      },
    ],
    mustSee: ["松恩峽灣遊船上的瀑布與山景", "布呂根彩色木屋巷弄", "卑爾根港灣夜景"],
    mustEat: ["卑爾根肉桂麵包 Skillingsbolle：在地代表點心，多數含蛋，奶素請先詢問"],
    mustBuy: ["布呂根巷弄裡的手工藝品與木雕", "挪威棕起司 Brunost（真空包裝較好攜帶）"],
    veg: [
      { name: "Dirty Vegan", area: "卑爾根 Nøstet", type: "全素", note: "粉紅外觀的全素速食店，漢堡、蒜味薯條評價高。", address: "Nøstegaten 81, 5011 Bergen, Norway", website: "https://dirtyv.no", hours: "週一至週四 15:00–21:00、週五至週六 15:00–22:00、週日 15:00–21:00" },
      { name: "Daily Pot", area: "卑爾根市中心", type: "素食", note: "以植物性食材為主，菜單每週更換，店面小。", address: "Vaskerelven 21, 5014 Bergen, Norway", website: "https://www.dailypot.no", hours: "每日 11:00–21:00" },
      { name: "Pygmalion Økocafe & Galleri", area: "卑爾根市中心", type: "素食友善", note: "有機咖啡館兼藝廊，提供素食與純素選擇；原列的 Dwell 已歇業。", address: "Nedre Korskirkeallmenningen 4, 5017 Bergen, Norway", website: "https://www.visitnorway.no/listings/pygmalion-as/281713/", hours: "週一至週六 11:00–21:45、週日 11:00–16:45（需再確認）" },
    ],
    meals: { breakfast: "飯店早餐", lunch: "中式素食六菜一湯", dinner: "飯店主廚奶素料理" },
    hotel: "SCANDIC HOTEL／RADISSON BLU／THON HOTEL 或四星同等級",
  },
  {
    day: 6,
    title: "哈丹格峽灣・大橋與沃林瀑布",
    route: "卑爾根 → 哈丹格大橋 → 沃林瀑布 → 卑爾根",
    image: "/images/hardanger-bridge.jpg",
    imageAlt: "橫跨哈丹格峽灣的哈丹格大橋",
    gallery: [{ src: "/images/voringsfossen.jpg", alt: "沃林瀑布從峽谷傾瀉而下" }],
    intro:
      "哈丹格峽灣全長 179 公里，是挪威第二長峽灣。兩岸地勢平緩、遍布蘋果與櫻桃果園，被暱稱為「女人峽灣」。行車參考：卑爾根 → 137 公里 → 哈丹格大橋 → 32 公里 → 沃林瀑布 → 169 公里 → 卑爾根。",
    spots: [
      {
        name: "哈丹格峽灣大橋", hours: "24 小時通行（車輛以 AutoPASS 自動收費）", website: "https://ferde.no/en/toll-stations-and-prices/the-hardanger-bridge",
        desc: "2013 年通車，主跨 1,310 公尺，是世界最長的吊橋之一。橋面距離峽灣水面 55 公尺，橋墩直接嵌入兩側山岩峭壁。",
      },
      {
        name: "沃林瀑布 Vøringsfossen", hours: "戶外 24 小時；停車場與廁所開放至 10/31（視天候），觀景步道遇雪可能封閉；Fossli 飯店與咖啡廳 10 月已休季", website: "https://hardangerfjord.com/en/eidfjord/attractions/voringsfossen-1571743",
        desc: "位於 Måbødalen 山谷頂部、挪威 7 號國道旁，總落差 182 公尺，是挪威最著名的瀑布之一，可從峽谷上方的觀景步道俯瞰。",
      },
    ],
    mustSee: ["哈丹格峽灣兩岸果園與村落教堂", "沃林瀑布上方的觀景步道", "哈丹格大橋的峽灣全景"],
    mustEat: ["哈丹格蘋果汁：峽灣區果園盛產蘋果，在地果汁香甜"],
    mustBuy: ["哈丹格蘋果汁／蘋果酒", "哈丹格刺繡 Hardangersøm 織品"],
    veg: [],
    vegNote: "沿途餐廳選擇少，午餐請旅行社預先安排奶素；晚餐回到卑爾根可參考前一天的素食店家。",
    meals: { breakfast: "飯店早餐", lunch: "中式素食六菜一湯", dinner: "飯店主廚奶素料理" },
    hotel: "SCANDIC HOTEL／RADISSON BLU／THON HOTEL 或四星同等級",
  },
  {
    day: 7,
    title: "飛往北極圈・渡輪前往羅浮敦",
    route: "卑爾根 ✈ 博德 ⛴ 莫斯克內斯 → 雷訥",
    flight: "WF1303 BGO/BOO 07:30 – 10:20",
    image: "/images/lofoten.jpg",
    imageAlt: "羅浮敦群島雷訥漁村與尖峰",
    aurora: true,
    intro: "搭乘威德羅航空飛往北極圈內的博德，再搭約 3 小時渡輪橫越挪威海，前往羅浮敦群島南端。",
    spots: [
      { name: "博德 Bodø", hours: "城市戶外，全天可遊覽", desc: "位於北極圈以北，是前往羅浮敦群島的海空交通門戶，具濃厚北挪威海港風情。" },
      { name: "羅浮敦渡輪", hours: "博德－莫斯克內斯渡輪 10/1 起採冬季班表，每日約 1–2 班（直航約 3–3.5 小時），班次依星期不同，需預訂並再確認", website: "https://www.torghatten-nord.no", desc: "天氣晴朗時，可遠眺羅浮敦群島陡峭山峰從海平線逐漸浮現。" },
      {
        name: "雷訥 Reine", hours: "戶外漁村，全天開放",
        desc: "被群山與峽灣環繞的傳統漁村，紅色漁屋沿岸分布，是羅浮敦最具代表性的景色，也是挪威北部著名攝影勝地。",
      },
      {
        name: "傳統海濱漁屋 Rorbuer", hours: "住宿設施，依入住時間辦理（一般 15:00 後入住）",
        desc: "昔日漁民捕鱈魚時居住的木造漁屋，整修後兼具傳統風貌與舒適設施。晚餐後視天候尋找光害少的安全地點，迎接第一晚極光。",
      },
    ],
    mustSee: ["渡輪上看羅浮敦山脈浮出海面", "雷訥紅色漁屋與尖峰倒影", "第一晚極光觀測"],
    mustEat: ["漁屋晚餐：請旅行社預先告知奶素需求"],
    mustBuy: ["羅浮敦在地藝術家的陶藝與攝影作品"],
    veg: [],
    vegNote: "雷訥一帶餐廳以海鮮為主、素食選擇很少，請旅行社事先與漁屋餐廳確認奶素餐；也可在當地超市補給乳製品與麵包。",
    warning:
      "漁屋房型、大小與衛浴配置可能不同；如遇滿房將改住鄰近飯店。車輛無法直接開到漁屋，請準備一日過夜小包。",
    meals: { breakfast: "飯店早餐", lunch: "北歐風味奶素餐", dinner: "主廚推薦奶素餐" },
    hotel: "羅浮敦特色住宿・傳統海濱漁屋 Rorbuer",
  },
  {
    day: 8,
    title: "羅浮敦漁村巡禮",
    route: "雷訥 → 奧鎮 → 哈姆諾伊 → 亨寧斯韋爾 → 魔法冰雕館 → 斯沃爾韋爾",
    image: "/images/hamnoy.jpg",
    imageAlt: "哈姆諾伊海岸岩石上的紅色漁屋",
    gallery: [
      { src: "/images/henningsvaer.jpg", alt: "亨寧斯韋爾港灣" },
      { src: "/images/svolvaer.jpg", alt: "斯沃爾韋爾港口與山峰" },
    ],
    aurora: true,
    intro: "沿著羅浮敦公路由南往北，一天走訪群島最經典的漁村。斯沃爾韋爾位於北緯約 68.2 度，是 10 月賞極光的理想據點。",
    spots: [
      { name: "奧鎮 Å", hours: "戶外漁村全天開放；挪威漁村博物館 10 月約每日 11:00–15:00；鱈魚乾博物館淡季時間未公布，需預約或再確認", website: "https://museumnord.no", desc: "羅浮敦公路的最南端，保留紅色漁屋與鱈魚加工建築，呈現昔日北挪威漁民生活。" },
      {
        name: "哈姆諾伊 Hamnøy", hours: "戶外漁村，全天開放",
        desc: "羅浮敦著名攝影地點，紅色漁屋坐落在海岸岩石上，後方是雄偉的奧爾斯廷山，從附近橋梁可欣賞經典全景。",
      },
      {
        name: "亨寧斯韋爾 Henningsvær", hours: "戶外漁村全天開放；藝廊、咖啡館淡季營業時間縮短",
        desc: "有「羅浮敦威尼斯」之稱，漁村分布在數座以橋相連的小島上，港邊排列彩色木屋、藝廊與咖啡館。",
      },
      { name: "魔法冰雕館 Magic Ice", hours: "淡季（約 8 月底至 5 月）每日 18:00–22:00；15 人以上團體可預約提早入館", website: "https://www.magicice.no", desc: "位於斯沃爾韋爾的冰雕藝術館，以冰雕呈現羅浮敦的漁村生活與北國風情。" },
      {
        name: "斯沃爾韋爾 Svolvær", hours: "城市戶外，全天可遊覽",
        desc: "羅浮敦的商業與觀光中心，代表地標是雙角狀的「山羊峰」Svolværgeita，港邊有餐廳、商店與步道。",
      },
    ],
    mustSee: ["奧鎮鱈魚乾架與傳統漁村", "哈姆諾伊橋上的漁村全景", "亨寧斯韋爾港灣", "斯沃爾韋爾山羊峰", "第二晚極光觀測"],
    mustEat: [
      "奧鎮百年麵包坊 Bakeriet på Å 的肉桂捲：被譽為羅浮敦最好吃，但含蛋；季節性營業約至 10/12，本日正好是 10/12，需先確認是否營業",
    ],
    mustBuy: ["亨寧斯韋爾藝廊的玻璃與陶藝作品", "魔法冰雕館紀念品"],
    veg: [
      { name: "Fiskekrogen", area: "亨寧斯韋爾", type: "素食友善", note: "海鮮餐廳，但固定提供以在地食材製作的素食選項。秋冬常休業，10 月很可能未營業，可改到斯沃爾韋爾的 Nordis 用餐。", address: "Dreyers gate 29, 8312 Henningsvær, Norway", website: "https://www.fiskekrogen.no", hours: "季節性營業；2026 年 10 月官網公告休業至隔年 2 月" },
      { name: "Nordis Restaurant", area: "斯沃爾韋爾", type: "素食友善", note: "義式與歐式料理，有素食披薩、沙拉等選擇，冬季照常營業。", address: "Torget 15, 8300 Svolvær, Norway", website: "https://nordisrestaurant.no/svolvar", hours: "每日 11:00–23:00（廚房至 22:00，午餐 11:00–15:00）" },
    ],
    meals: { breakfast: "飯店早餐", lunch: "北歐風味奶素餐", dinner: "主廚推薦奶素餐" },
    hotel: "THON HOTEL SVOLVÆR／THON HOTEL LOFOTEN 或四星同等級",
  },
  {
    day: 9,
    title: "北極圈景觀鐵道・跨境瑞典基律納",
    route: "斯沃爾韋爾 → 納爾維克 🚆 基律納",
    image: "/images/ofoten.jpg",
    imageAlt: "行駛在奧福特鐵路高架橋上的列車",
    gallery: [
      { src: "/images/kiruna.jpg", alt: "秋天的基律納市區" },
      { src: "/images/abisko.jpg", alt: "阿比斯庫托爾訥湖畔的極光" },
    ],
    aurora: true,
    intro:
      "車程約 220 公里抵達納爾維克，再搭北極圈景觀列車跨越國境。基律納位於瑞典拉普蘭、北緯約 67.9 度，10 月中旬已進入極光季。",
    spots: [
      { name: "納爾維克 Narvik", hours: "城市戶外，全天可遊覽", desc: "奧福特峽灣沿岸的不凍港，長期是瑞典鐵礦石出口要港，兼具峽灣風光、鐵道歷史與二戰文化背景。" },
      {
        name: "北極圈景觀鐵道 Ofoten Line", hours: "由瑞典 SJ 營運，納爾維克－基律納約 3 小時，每日約 1–2 班，需預訂並再確認班次", website: "https://www.sj.se",
        desc: "1902 年通車的百年鐵路，列車從峽灣山坡攀升到北極高原，越過國界後行經阿比斯庫國家公園與托爾訥湖。",
      },
      { name: "基律納 Kiruna", hours: "城市戶外，全天可遊覽（市中心因礦區正在搬遷）", desc: "瑞典最北的城市之一，擁有遼闊的北方森林、高原與湖泊，今晚是第三晚極光觀測。" },
    ],
    mustSee: ["列車沿途的奧福特峽灣", "阿比斯庫國家公園與托爾訥湖", "第三晚極光觀測"],
    mustEat: ["瑞典 Fika 下午茶：咖啡配肉桂捲 Kanelbulle（多數含蛋，請先詢問）"],
    mustBuy: ["薩米族傳統手工藝品", "越橘 Lingon 果醬"],
    veg: [
      { name: "JǫR Håndverksbakeri", area: "納爾維克圖書館內", type: "素食友善", note: "手工麵包坊，有純素肉桂捲與麵包，店員熟悉素食需求。", address: "Kongens gate 39, 8514 Narvik, Norway", website: "https://www.visitnarvik.com/en/partner/jor-artisan-bakery-0", hours: "週二至週日 10:00–16:00、週一休息" },
      { name: "Spill Saluhall & Eatery", area: "基律納", type: "素食友善", note: "休閒餐廳，素食菜色每週輪替。", address: "Lastvägen 54, 981 33 Kiruna, Sweden", website: "https://www.spillmer.se", hours: "週一至週四 08:00–23:00、週五 08:00–01:00、週六 10:00–01:00、週日 10:00–23:00（需再確認）" },
      { name: "Restaurang Fe", area: "基律納（Elite Hotel Frost）", type: "素食友善", note: "以北方在地食材為主的精緻餐廳，提供素食選項；10/13 為週三，有營業。", address: "Elite Hotel Frost, Torggatan 5, 981 30 Kiruna, Sweden", website: "https://www.elite.se/en/restaurants/kiruna/Restaurang-Fe-eng/", hours: "週三至週六 17:00–22:00（晚餐），週日至週二休息" },
    ],
    meals: { breakfast: "飯店早餐", lunch: "北歐風味奶素餐", dinner: "主廚推薦奶素餐" },
    hotel: "Scandic Kiruna／Elite Hotel Frost 或四星同等級",
  },
  {
    day: 10,
    title: "北歐威尼斯斯德哥爾摩",
    route: "基律納 ✈ 斯德哥爾摩",
    flight: "SK1049 KRN/STO 05:45 – 07:35",
    image: "/images/vasa.jpg",
    imageAlt: "瓦薩號戰艦船尾的木雕",
    gallery: [
      { src: "/images/gamla-stan.jpg", alt: "斯德哥爾摩老城巷弄" },
      { src: "/images/sweden.jpg", alt: "從船島眺望老城天際線" },
    ],
    intro: "斯德哥爾摩建在波羅的海與梅拉倫湖之間，市區由兩萬多座大小島嶼組成，被譽為「北歐威尼斯」。",
    spots: [
      {
        name: "瓦薩號戰艦博物館（入內參觀）", hours: "9–5 月每日 10:00–17:00，週三延長至 20:00", website: "https://www.vasamuseet.se",
        desc: "1628 年首航即沉沒、1961 年打撈出水。波羅的海的低鹽環境讓船體保存良好，船身數百件精緻雕刻展現瑞典帝國時代的造船工藝。",
      },
      { name: "老城區 Gamla Stan", hours: "戶外街區，全天開放", desc: "由老城島、騎士島、聖靈島組成的歷史核心區，保存完好，臨河臨海的街道最值得漫步。" },
      { name: "斯德哥爾摩王宮", hours: "10–12 月每日 10:00–16:00；遇皇室活動可能臨時關閉", website: "https://www.kungligaslotten.se", desc: "融合義大利巴洛克與法國洛可可風格的三層建築，是歷代瑞典皇室舉行儀式的場所。" },
      { name: "斯德哥爾摩大教堂", hours: "每日 09:30–17:00；遇禮拜或音樂會可能縮短", website: "https://www.svenskakyrkan.se/stockholmsdomkyrkoforsamling", desc: "城內歷史最悠久的教堂，也是瑞典皇室舉行重大慶典的地方。" },
      { name: "斯德哥爾摩音樂廳", hours: "外觀全天可參觀；導覽主要於週六 13:00（瑞典語），英語導覽需另洽", website: "https://konserthuset.se/en/your-visit/guided-tours", desc: "1926 年落成的藍色音樂廳，是每年諾貝爾獎頒獎典禮的舉辦地。" },
      { name: "地鐵藝術站", hours: "地鐵平日約 05:00–01:00，週五、六整夜行駛；持 SL 車票即可參觀", website: "https://sl.se", desc: "1957 年起每座新站都與藝術家合作，被稱為世界最長的地下藝術長廊。" },
    ],
    mustSee: ["瓦薩號船身雕刻", "老城彩色山牆與鵝卵石巷", "王宮外觀", "地鐵站藝術"],
    mustEat: ["老城 Fika 咖啡館：瑞典人的午茶時光"],
    mustBuy: ["達拉木馬 Dalahäst：瑞典代表性手工木馬", "Marabou 牛奶巧克力"],
    veg: [
      { name: "Hermitage", area: "老城區（Stora Nygatan）", type: "素食", note: "老城內的素食自助餐，每日輪替主菜、湯品與沙拉，只收卡。", address: "Stora Nygatan 11, 111 27 Stockholm, Sweden", website: "https://greenhermitage.se", hours: "冬季（10 月起）週一至週五 11:00–20:00、週末 12:00–20:00" },
      { name: "Hermans", area: "南島 Södermalm", type: "素食", note: "1992 年開業的素食自助餐老店，可俯瞰水岸，建議訂位。", address: "Fjällgatan 23B, 116 28 Stockholm, Sweden", website: "https://www.hermans.se", hours: "週一至週四 11:00–21:00、週五 11:00–22:00、週六 12:00–22:00、週日 12:00–21:00（自助餐提早 1 小時結束）" },
    ],
    warning: "今日 05:45 起飛，凌晨需提早出發前往機場。晚餐自理，可參考上方素食店家。",
    meals: { breakfast: "機上餐點", lunch: "中式素食七菜一湯＋水果", dinner: "敬請自理" },
    hotel: "RADISSON BLU／COURTYARD BY MARRIOTT／THON HOTEL 或四星同等級",
  },
  {
    day: 11,
    title: "斯德哥爾摩市政廳・國王花園・食品市場",
    route: "斯德哥爾摩市區",
    image: "/images/city-hall.jpg",
    imageAlt: "斯德哥爾摩市政廳夜景",
    intro: "今日深入斯德哥爾摩的建築、皇家花園與美食市場。",
    spots: [
      {
        name: "市政廳與諾貝爾獎晚宴廳（入內參觀）", hours: "僅能參加導覽（約 45 分鐘）；10–12 月英語導覽約 10:00–15:00 整點出發，部分日子場次較少，可能臨時閉館；10 人以上需預約包場導覽", website: "https://stadshuset.stockholm/en/visit-stockholm-city-hall/guided-tours",
        desc: "由建築師 Ragnar Östberg 設計，1911 年動工、歷時 12 年完成，106 公尺紅磚高塔被譽為 20 世紀歐洲最美建築之一。藍廳是諾貝爾獎晚宴場地，金廳則舉辦慶祝舞會。",
      },
      { name: "國王花園 Kungsträdgården", hours: "戶外公園，全天開放", website: "https://kungstradgarden.se", desc: "周邊咖啡廳、餐廳與畫廊林立，是市中心熱門的聚會地點，對面就是百貨公司。" },
      { name: "東城食品市場 Östermalms Saluhall", hours: "週一至週五 09:30–19:00、週六 09:30–17:00、週日休息（餐廳營業較晚）", website: "https://ostermalmshallen.se", desc: "瑞典傳統食品市場，可找到各式起司、麵包、巧克力與甜點。" },
    ],
    mustSee: ["市政廳藍廳與金廳", "國王花園", "東城食品市場"],
    mustEat: ["東城食品市場的瑞典起司與脆麵包 Knäckebröd：部分起司使用動物性凝乳酶，請詢問店家"],
    mustBuy: ["瑞典設計家居小物", "越橘果醬與雲莓果醬"],
    veg: [
      { name: "Hermitage", area: "老城區", type: "素食", note: "素食自助餐，距離市政廳步行可到。", address: "Stora Nygatan 11, 111 27 Stockholm, Sweden", website: "https://greenhermitage.se", hours: "冬季（10 月起）週一至週五 11:00–20:00、週末 12:00–20:00" },
      { name: "Hermans", area: "南島 Södermalm", type: "素食", note: "素食自助餐老店，適合作為自理晚餐。", address: "Fjällgatan 23B, 116 28 Stockholm, Sweden", website: "https://www.hermans.se", hours: "週一至週四 11:00–21:00、週五 11:00–22:00、週六 12:00–22:00、週日 12:00–21:00（自助餐提早 1 小時結束）" },
    ],
    meals: { breakfast: "飯店早餐", lunch: "中式素食七菜一湯＋水果", dinner: "敬請自理" },
    hotel: "RADISSON BLU／COURTYARD BY MARRIOTT／THON HOTEL 或四星同等級",
  },
  {
    day: 12,
    title: "告別北歐",
    route: "斯德哥爾摩 ✈ 曼谷",
    flight: "TG961 STO/BKK 13:50 – 05:50（+1）",
    intro: "整理行囊後前往機場，搭機經曼谷返回高雄。",
    spots: [],
    mustSee: [],
    mustEat: [],
    mustBuy: [],
    veg: [],
    meals: { breakfast: "飯店早餐", lunch: "機上奶素餐", dinner: "機上奶素餐" },
    hotel: "豪華客機",
  },
  {
    day: 13,
    title: "返抵高雄",
    route: "曼谷 ✈ 高雄",
    flight: "TG630 BKK/KHH 11:45 – 16:15",
    intro: "帶著滿滿的極光、峽灣與漁村回憶，平安返抵溫暖的家。",
    spots: [],
    mustSee: [],
    mustEat: [],
    mustBuy: [],
    veg: [],
    meals: { breakfast: "機上奶素餐", lunch: "機上奶素餐", dinner: "—" },
    hotel: "溫暖的家",
  },
];

export const dietTips = [
  { title: "蛋", desc: "北歐的肉桂捲、鬆餅、蛋糕、美乃滋大多含蛋，點餐時請說明「不吃蛋」。" },
  { title: "動物性凝乳酶", desc: "部分起司使用動物性凝乳酶製作；棕起司 Brunost 由乳清熬煮，通常不使用凝乳酶。" },
  { title: "明膠", desc: "軟糖、慕斯、部分優格可能含明膠，購買零食時請看成分標示（gelatin）。" },
  { title: "高湯與醬汁", desc: "湯品常用肉或魚高湯，醬汁可能含鯷魚，請確認是否為蔬菜高湯。" },
  { title: "五辛", desc: "北歐料理普遍使用洋蔥與大蒜。若團員不吃五辛，請在報名表註明，旅行社會另外與餐廳溝通。" },
];

export const phrases = [
  { lang: "挪威文", text: "Jeg er vegetarianer. Jeg spiser ikke kjøtt, fisk eller egg." },
  { lang: "瑞典文", text: "Jag är vegetarian. Jag äter inte kött, fisk eller ägg." },
  { lang: "中文意思", text: "我吃素，不吃肉、魚和蛋。" },
];
