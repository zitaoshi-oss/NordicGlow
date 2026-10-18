// 景點地圖資料：每篇文章對應一個地圖標點，加上依每日行程連起來的交通動線。
// 座標為景點大致位置（WGS84），動線為示意路線，並非實際道路／航線軌跡。

export type TransportMode = "bus" | "train" | "ferry" | "flight";

export const transportModes: Record<TransportMode, { label: string; icon: string; color: string; dash?: string }> = {
  bus: { label: "遊覽車", icon: "🚌", color: "#6ee7b7" },
  train: { label: "景觀鐵道", icon: "🚆", color: "#fbbf24", dash: "10 6" },
  ferry: { label: "渡輪／遊船", icon: "⛴️", color: "#7dd3fc", dash: "2 8" },
  flight: { label: "國內航班", icon: "✈️", color: "#e2e8f0", dash: "1 10" },
};

export type MapStop = {
  slug: string; // 對應 lib/blog.ts 的文章
  name: string;
  day: number;
  lat: number;
  lng: number;
  aurora?: boolean; // 當晚是極光觀測點
};

export const mapStops: MapStop[] = [
  { slug: "oslo", name: "奧斯陸", day: 2, lat: 59.907, lng: 10.753 },
  { slug: "holmenkollen", name: "霍爾門考倫", day: 3, lat: 59.9637, lng: 10.6676 },
  { slug: "flam-railway", name: "弗萊姆高山鐵道", day: 4, lat: 60.8628, lng: 7.1137 },
  { slug: "sognefjord", name: "松恩峽灣", day: 5, lat: 60.915, lng: 6.93 },
  { slug: "bryggen", name: "卑爾根布呂根", day: 5, lat: 60.3975, lng: 5.324 },
  { slug: "hardanger-bridge", name: "哈丹格大橋", day: 6, lat: 60.4703, lng: 6.8239 },
  { slug: "voringsfossen", name: "沃林瀑布", day: 6, lat: 60.4253, lng: 7.2522 },
  { slug: "reine", name: "雷訥", day: 7, lat: 67.9326, lng: 13.089, aurora: true },
  { slug: "hamnoy", name: "哈姆諾伊・奧鎮", day: 8, lat: 67.948, lng: 13.133 },
  { slug: "henningsvaer", name: "亨寧斯韋爾", day: 8, lat: 68.1546, lng: 14.205 },
  { slug: "svolvaer", name: "斯沃爾韋爾", day: 8, lat: 68.2343, lng: 14.5683, aurora: true },
  { slug: "ofoten-line", name: "納爾維克・奧福特鐵路", day: 9, lat: 68.4385, lng: 17.4273 },
  { slug: "kiruna", name: "基律納", day: 9, lat: 67.8558, lng: 20.2253, aurora: true },
  { slug: "vasa", name: "瓦薩號博物館", day: 10, lat: 59.328, lng: 18.0914 },
  { slug: "gamla-stan", name: "老城區", day: 10, lat: 59.3251, lng: 18.0711 },
  { slug: "stockholm-city", name: "斯德哥爾摩市區", day: 11, lat: 59.3313, lng: 18.0716 },
  { slug: "city-hall", name: "斯德哥爾摩市政廳", day: 11, lat: 59.3275, lng: 18.0543 },
];

// 跨越多個地點、沒有單一標點的主題文章
export const themePosts = [{ slug: "aurora", name: "北極圈三夜追極光", icon: "🌌" }];

export type RouteLeg = {
  day: number;
  mode: TransportMode;
  from: string;
  to: string;
  path: [number, number][]; // [lat, lng]，含中途轉折點
};

const P = {
  osl: [60.1939, 11.1004],
  oslo: [59.907, 10.753],
  holmenkollen: [59.9637, 10.6676],
  hemsedal: [60.863, 8.552],
  flam: [60.8628, 7.1137],
  myrdal: [60.7353, 7.1219],
  gudvangen: [60.879, 6.841],
  voss: [60.628, 6.417],
  bergen: [60.3975, 5.324],
  hardanger: [60.4703, 6.8239],
  voringsfossen: [60.4253, 7.2522],
  bgo: [60.2934, 5.2181],
  bodo: [67.2804, 14.4049],
  moskenes: [67.8986, 13.059],
  reine: [67.9326, 13.089],
  a: [67.8797, 12.982],
  hamnoy: [67.948, 13.133],
  henningsvaer: [68.1546, 14.205],
  svolvaer: [68.2343, 14.5683],
  narvik: [68.4385, 17.4273],
  kiruna: [67.8558, 20.2253],
  krn: [67.8219, 20.3368],
  arn: [59.6498, 17.9238],
  stockholm: [59.3293, 18.0686],
} satisfies Record<string, [number, number]>;

export const routeLegs: RouteLeg[] = [
  { day: 2, mode: "bus", from: "奧斯陸機場", to: "奧斯陸", path: [P.osl, P.oslo] },
  { day: 3, mode: "bus", from: "奧斯陸", to: "霍爾門考倫", path: [P.oslo, P.holmenkollen] },
  { day: 3, mode: "bus", from: "霍爾門考倫", to: "峽灣區（海姆瑟達爾）", path: [P.holmenkollen, [60.17, 10.25], [60.55, 9.25], P.hemsedal] },
  { day: 4, mode: "bus", from: "峽灣區", to: "弗萊姆", path: [P.hemsedal, [61.0, 7.9], [60.95, 7.4], P.flam] },
  { day: 4, mode: "train", from: "弗萊姆", to: "米達爾（往返）", path: [P.flam, [60.81, 7.12], P.myrdal] },
  { day: 5, mode: "ferry", from: "弗萊姆", to: "古德凡根（松恩峽灣遊船）", path: [P.flam, [60.93, 7.08], [60.97, 7.0], [60.93, 6.9], P.gudvangen] },
  { day: 5, mode: "bus", from: "古德凡根", to: "卑爾根", path: [P.gudvangen, P.voss, [60.45, 5.75], P.bergen] },
  { day: 6, mode: "bus", from: "卑爾根", to: "哈丹格大橋", path: [P.bergen, [60.36, 5.95], [60.47, 6.4], P.hardanger] },
  { day: 6, mode: "bus", from: "哈丹格大橋", to: "沃林瀑布", path: [P.hardanger, [60.42, 7.07], P.voringsfossen] },
  { day: 7, mode: "flight", from: "卑爾根", to: "博德", path: [P.bgo, P.bodo] },
  { day: 7, mode: "ferry", from: "博德", to: "莫斯克內斯", path: [P.bodo, P.moskenes] },
  { day: 7, mode: "bus", from: "莫斯克內斯", to: "雷訥", path: [P.moskenes, P.reine] },
  { day: 8, mode: "bus", from: "雷訥", to: "奧鎮", path: [P.reine, P.a] },
  { day: 8, mode: "bus", from: "奧鎮", to: "哈姆諾伊", path: [P.a, P.reine, P.hamnoy] },
  { day: 8, mode: "bus", from: "哈姆諾伊", to: "亨寧斯韋爾", path: [P.hamnoy, [68.06, 13.55], [68.12, 13.9], P.henningsvaer] },
  { day: 8, mode: "bus", from: "亨寧斯韋爾", to: "斯沃爾韋爾", path: [P.henningsvaer, [68.2, 14.35], P.svolvaer] },
  { day: 9, mode: "bus", from: "斯沃爾韋爾", to: "納爾維克", path: [P.svolvaer, [68.41, 14.79], [68.53, 15.73], [68.58, 16.36], [68.55, 17.56], P.narvik] },
  { day: 9, mode: "train", from: "納爾維克", to: "基律納（跨境）", path: [P.narvik, [68.426, 18.125], [68.4, 18.68], [68.3495, 18.8312], [68.1, 19.6], P.kiruna] },
  { day: 10, mode: "flight", from: "基律納", to: "斯德哥爾摩", path: [P.krn, P.arn] },
  { day: 10, mode: "bus", from: "阿蘭達機場", to: "斯德哥爾摩市區", path: [P.arn, P.stockholm] },
];

// 航班畫成弧線，讓它和地面路線一眼就能分開
export function legPath(leg: RouteLeg): [number, number][] {
  if (leg.mode !== "flight") return leg.path;
  const [a, b] = [leg.path[0], leg.path[leg.path.length - 1]];
  const [dLat, dLng] = [b[0] - a[0], b[1] - a[1]];
  const ctrl: [number, number] = [(a[0] + b[0]) / 2 - dLng * 0.15, (a[1] + b[1]) / 2 + dLat * 0.15];
  return Array.from({ length: 33 }, (_, i) => {
    const t = i / 32;
    const u = 1 - t;
    return [u * u * a[0] + 2 * u * t * ctrl[0] + t * t * b[0], u * u * a[1] + 2 * u * t * ctrl[1] + t * t * b[1]];
  });
}
