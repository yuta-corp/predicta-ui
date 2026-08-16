/**
 * Catalogue des quartiers d'Antananarivo — GÉNÉRÉ, ne pas éditer à la main.
 * Source : V1__quartiers.sql (migration Predicta API).
 * Contient la clé primaire (quartier_id) absente de l'endpoint /quartiers,
 * nécessaire à GET /traffic/quartier/{id}.
 *
 * Régénérer : pnpm generate:quartiers
 */

import type { Quartier } from "@/lib/types/traffic"

export const quartiers: readonly Quartier[] = [
  { id: "n_837558568", name: "67 ha", source: "osm_suburb", lon: 47.5084707, lat: -18.90518273 },
  { id: "n_725856151", name: "67 ha Atsimo", source: "osm_neighbourhood", lon: 47.50602225, lat: -18.90985853 },
  { id: "n_837558567", name: "67 ha Avaratra Andrefana", source: "osm_neighbourhood", lon: 47.50591572, lat: -18.90301144 },
  { id: "n_12504457186", name: "67 ha Avaratra Atsinanana", source: "osm_neighbourhood", lon: 47.51193316, lat: -18.90255286 },
  { id: "n_12062907602", name: "Akany Marisa", source: "osm_locality", lon: 47.52158466, lat: -18.86688795 },
  { id: "n_687168436", name: "Alarobia", source: "osm_suburb", lon: 47.51847491, lat: -18.87290438 },
  { id: "n_687180726", name: "Alasora", source: "osm_suburb", lon: 47.56509556, lat: -18.95516895 },
  { id: "n_5454040963", name: "Ambaniala", source: "osm_suburb", lon: 47.48923688, lat: -18.9213059 },
  { id: "n_5680854302", name: "Ambanidia", source: "osm_suburb", lon: 47.53962061, lat: -18.91873985 },
  { id: "n_5454040949", name: "Ambanilalana", source: "osm_suburb", lon: 47.48088191, lat: -18.91864982 },
  { id: "rel_7772751", name: "Ambanimaso", source: "osm_admin", lon: 47.4944255, lat: -18.93987173 },
  { id: "n_12504002875", name: "Ambanin'Ampamarinana", source: "osm_neighbourhood", lon: 47.5291669, lat: -18.92173285 },
  { id: "n_688357092", name: "Ambaranjana", source: "osm_neighbourhood", lon: 47.54042852, lat: -18.91176056 },
  { id: "n_5535778698", name: "Ambato", source: "osm_neighbourhood", lon: 47.48902405, lat: -18.89220844 },
  { id: "n_573536052", name: "Ambatobe", source: "osm_suburb", lon: 47.55707441, lat: -18.87929528 },
  { id: "rel_17812935", name: "Ambatofahavalo", source: "osm_admin", lon: 47.61291282, lat: -19.08599661 },
  { id: "n_7149564249", name: "Ambatofotsy Avaradrano", source: "osm_suburb", lon: 47.57685389, lat: -18.82723901 },
  { id: "n_9112918006", name: "Ambatokaranana", source: "osm_neighbourhood", lon: 47.54850365, lat: -18.8979361 },
  { id: "n_4046331598", name: "Ambatolampy", source: "osm_neighbourhood", lon: 47.44676236, lat: -18.88710091 },
  { id: "n_668739128", name: "Ambatolampy Antehiroka", source: "osm_suburb", lon: 47.49224943, lat: -18.84559322 },
  { id: "n_12504457193", name: "Ambatomainty", source: "osm_suburb", lon: 47.53755784, lat: -18.89039364 },
  { id: "n_681137790", name: "Ambatomaro", source: "osm_suburb", lon: 47.56415435, lat: -18.90246323 },
  { id: "n_12504457190", name: "Ambatomena", source: "osm_neighbourhood", lon: 47.52383117, lat: -18.90801937 },
  { id: "n_686543334", name: "Ambatonakanga", source: "osm_neighbourhood", lon: 47.52735343, lat: -18.91308797 },
  { id: "n_13462289224", name: "Ambatondratemo", source: "osm_neighbourhood", lon: 47.47686327, lat: -18.92973947 },
  { id: "n_7122857438", name: "Ambatonilita", source: "osm_neighbourhood", lon: 47.52187056, lat: -18.91092789 },
  { id: "n_694070647", name: "Ambatoroka", source: "osm_suburb", lon: 47.54195637, lat: -18.92426728 },
  { id: "n_12504002880", name: "Ambatoroka Ambany", source: "osm_neighbourhood", lon: 47.54675968, lat: -18.92326257 },
  { id: "n_686543332", name: "Ambatovinaky", source: "osm_neighbourhood", lon: 47.52977717, lat: -18.91484838 },
  { id: "n_686542283", name: "Ambavahadimitafo", source: "osm_neighbourhood", lon: 47.53404888, lat: -18.92146504 },
  { id: "n_931540836", name: "Ambavahaditokana", source: "osm_suburb", lon: 47.46183493, lat: -18.92361871 },
  { id: "n_13462289211", name: "Ambavahaditokana Afovoany", source: "osm_quarter", lon: 47.46152596, lat: -18.92654019 },
  { id: "n_13462289212", name: "Ambavahaditokana Andrefana", source: "osm_quarter", lon: 47.45954521, lat: -18.9268326 },
  { id: "n_13462289216", name: "Ambavahaditokana Atsimo", source: "osm_quarter", lon: 47.45914308, lat: -18.92949623 },
  { id: "n_6830616464", name: "Ambilanibe", source: "osm_neighbourhood", lon: 47.5048191, lat: -18.91995853 },
  { id: "n_5454040955", name: "Amboatavo", source: "osm_suburb", lon: 47.46600574, lat: -18.91943684 },
  { id: "n_668739134", name: "Amboavahy", source: "osm_suburb", lon: 47.48113277, lat: -18.85811931 },
  { id: "n_931486392", name: "Ambodavena", source: "osm_neighbourhood", lon: 47.47685296, lat: -18.94782383 },
  { id: "n_687173784", name: "Ambodiafontsy", source: "osm_suburb", lon: 47.46373938, lat: -18.94090725 },
  { id: "n_5454040965", name: "Ambodiamberivatry", source: "osm_suburb", lon: 47.4857253, lat: -18.90789744 },
  { id: "n_5454040951", name: "Ambodiampanga Itaosy", source: "osm_neighbourhood", lon: 47.48321533, lat: -18.90456079 },
  { id: "n_5454111829", name: "Ambodifasika", source: "osm_suburb", lon: 47.46158495, lat: -18.90985632 },
  { id: "n_12504457191", name: "Ambodifilao", source: "osm_neighbourhood", lon: 47.52604872, lat: -18.90518133 },
  { id: "n_668739138", name: "Ambodihady", source: "osm_suburb", lon: 47.48088636, lat: -18.8757591 },
  { id: "n_6673192563", name: "Ambodihady Carriere", source: "osm_neighbourhood", lon: 47.48982885, lat: -18.88014795 },
  { id: "n_687191167", name: "Ambodimanga", source: "osm_neighbourhood", lon: 47.53896928, lat: -18.90110715 },
  { id: "n_5553415281", name: "Ambodimanga", source: "osm_neighbourhood", lon: 47.5456078, lat: -18.87999857 },
  { id: "n_668739133", name: "Ambodimita", source: "osm_suburb", lon: 47.48620048, lat: -18.8667415 },
  { id: "n_837558570", name: "Ambodinisotry", source: "osm_suburb", lon: 47.51081654, lat: -18.90722249 },
  { id: "n_12504457181", name: "Ambodirano", source: "osm_suburb", lon: 47.50009053, lat: -18.91500102 },
  { id: "n_681393250", name: "Ambodirotra", source: "osm_neighbourhood", lon: 47.53628237, lat: -18.90940133 },
  { id: "n_681447076", name: "Amboditsiry", source: "osm_suburb", lon: 47.53514856, lat: -18.88324397 },
  { id: "n_687168434", name: "Ambodivoanjo", source: "osm_suburb", lon: 47.53414041, lat: -18.87539003 },
  { id: "n_13462289213", name: "Ambodivoly Atsimo", source: "osm_suburb", lon: 47.45929305, lat: -18.92497485 },
  { id: "n_13462289215", name: "Ambodivoly Avaratra", source: "osm_quarter", lon: 47.45676932, lat: -18.92593014 },
  { id: "rel_7763986", name: "Ambodivona", source: "osm_admin", lon: 47.49341368, lat: -18.94404442 },
  { id: "n_13462289208", name: "Ambodivona", source: "osm_quarter", lon: 47.46051019, lat: -18.92031952 },
  { id: "n_12504457179", name: "Ambodivona", source: "osm_suburb", lon: 47.49915404, lat: -18.8627062 },
  { id: "n_620818114", name: "Ambodivona", source: "osm_suburb", lon: 47.52818625, lat: -18.89209544 },
  { id: "n_7149564265", name: "Ambodivondava", source: "osm_suburb", lon: 47.5521341, lat: -18.82890761 },
  { id: "n_668739147", name: "Ambodivonkely", source: "osm_suburb", lon: 47.50477224, lat: -18.88077593 },
  { id: "n_668739130", name: "Ambohibao", source: "osm_suburb", lon: 47.47535404, lat: -18.84315241 },
  { id: "n_837190453", name: "Ambohibarikely", source: "osm_suburb", lon: 47.51726259, lat: -18.92812161 },
  { id: "n_7149685723", name: "Ambohibary Namehana", source: "osm_suburb", lon: 47.52532344, lat: -18.82535753 },
  { id: "n_2274967032", name: "Ambohibe", source: "osm_suburb", lon: 47.57756434, lat: -18.87942919 },
  { id: "n_5454040958", name: "Ambohidahy", source: "osm_suburb", lon: 47.47953702, lat: -18.91368973 },
  { id: "n_4287310111", name: "Ambohidahy", source: "osm_neighbourhood", lon: 47.52529742, lat: -18.91332006 },
  { id: "n_844907666", name: "Ambohidahy", source: "osm_suburb", lon: 47.55583526, lat: -18.8950506 },
  { id: "n_12504457163", name: "Ambohidavenona", source: "osm_neighbourhood", lon: 47.45772789, lat: -18.89409694 },
  { id: "n_13462289217", name: "Ambohidralamabo", source: "osm_quarter", lon: 47.45457137, lat: -18.93126473 },
  { id: "n_5531126587", name: "Ambohidrapeto", source: "osm_suburb", lon: 47.46960531, lat: -18.89854279 },
  { id: "n_837197787", name: "Ambohidraserika", source: "osm_neighbourhood", lon: 47.54603551, lat: -18.93424723 },
  { id: "n_5796259520", name: "Ambohidrazaka", source: "osm_neighbourhood", lon: 47.57792568, lat: -18.94797529 },
  { id: "n_668739135", name: "Ambohidroa", source: "osm_suburb", lon: 47.48624263, lat: -18.85446287 },
  { id: "n_5454040964", name: "Ambohijafy", source: "osm_suburb", lon: 47.48939708, lat: -18.91107867 },
  { id: "n_12504457176", name: "Ambohijanahary Antehiroka", source: "osm_suburb", lon: 47.50113712, lat: -18.83207858 },
  { id: "n_12504457162", name: "Ambohijanamasoandro", source: "osm_neighbourhood", lon: 47.47274532, lat: -18.92244941 },
  { id: "n_13462289207", name: "Ambohijatovo", source: "osm_quarter", lon: 47.46572696, lat: -18.92597182 },
  { id: "n_686543335", name: "Ambohijatovo", source: "osm_suburb", lon: 47.52892142, lat: -18.91184797 },
  { id: "n_696956149", name: "Ambohijatovo", source: "osm_neighbourhood", lon: 47.54156224, lat: -18.87349974 },
  { id: "n_13462289225", name: "Ambohikely", source: "osm_neighbourhood", lon: 47.47643695, lat: -18.93327427 },
  { id: "n_681137737", name: "Ambohimahitsy", source: "osm_suburb", lon: 47.57171849, lat: -18.89854326 },
  { id: "n_12851851333", name: "Ambohimailala", source: "osm_suburb", lon: 47.5765224, lat: -18.86630896 },
  { id: "n_687173778", name: "Ambohimamory", source: "osm_suburb", lon: 47.48487143, lat: -18.93071812 },
  { id: "n_668739141", name: "Ambohimanandray", source: "osm_suburb", lon: 47.49568736, lat: -18.87136737 },
  { id: "n_667624395", name: "Ambohimanarina", source: "osm_suburb", lon: 47.50147913, lat: -18.87475555 },
  { id: "n_668739148", name: "Ambohimandroso", source: "osm_suburb", lon: 47.49683008, lat: -18.88331669 },
  { id: "n_13462289218", name: "Ambohimandroso Andrefana", source: "osm_neighbourhood", lon: 47.43489497, lat: -18.92667588 },
  { id: "n_13462289219", name: "Ambohimandroso Atsinanana", source: "osm_suburb", lon: 47.45124005, lat: -18.92940094 },
  { id: "n_687173774", name: "Ambohimangidy", source: "osm_suburb", lon: 47.48016186, lat: -18.96106639 },
  { id: "n_686542284", name: "Ambohimanoro", source: "osm_neighbourhood", lon: 47.5324639, lat: -18.91676984 },
  { id: "n_13462289221", name: "Ambohimarina", source: "osm_neighbourhood", lon: 47.46474418, lat: -18.93453582 },
  { id: "n_931486391", name: "Ambohimiadana", source: "osm_suburb", lon: 47.44394621, lat: -18.98986427 },
  { id: "n_681393174", name: "Ambohimiandra", source: "osm_suburb", lon: 47.54292533, lat: -18.92926011 },
  { id: "n_687191172", name: "Ambohimirary", source: "osm_suburb", lon: 47.55181567, lat: -18.89741242 },
  { id: "w_1311117945", name: "Ambohimitsimbina", source: "osm_suburb", lon: 47.5308678, lat: -18.92942979 },
  { id: "n_668739150", name: "Ambohimitsinjo", source: "osm_suburb", lon: 47.49448314, lat: -18.87508658 },
  { id: "n_5316748708", name: "Ambohinaorina", source: "osm_suburb", lon: 47.55042523, lat: -18.83511514 },
  { id: "n_5271851710", name: "Ambohipanja", source: "osm_suburb", lon: 47.54709582, lat: -18.84068526 },
  { id: "n_5680854300", name: "Ambohipo", source: "osm_suburb", lon: 47.55693545, lat: -18.92701615 },
  { id: "n_5680854867", name: "Ambohipo Tanàna", source: "osm_neighbourhood", lon: 47.56333474, lat: -18.933119 },
  { id: "n_12504457189", name: "Ambohipotsy", source: "osm_neighbourhood", lon: 47.53050248, lat: -18.93113687 },
  { id: "n_11224960451", name: "Ambohitrakely", source: "osm_suburb", lon: 47.5436344, lat: -18.9041002 },
  { id: "n_687168440", name: "Ambohitrarahaba", source: "osm_suburb", lon: 47.54561284, lat: -18.86134636 },
  { id: "n_7176802092", name: "Ambohitrimanjaka", source: "osm_suburb", lon: 47.4408433, lat: -18.86607439 },
  { id: "n_13462289206", name: "Ambohitrinimanga", source: "osm_quarter", lon: 47.46348748, lat: -18.92909815 },
  { id: "n_689610713", name: "Ambohitrinimanga", source: "osm_neighbourhood", lon: 47.54345584, lat: -18.88582599 },
  { id: "n_686378273", name: "Ambohitsoa", source: "osm_suburb", lon: 47.54193672, lat: -18.94098996 },
  { id: "n_681137785", name: "Ambolonkandrina", source: "osm_suburb", lon: 47.56152457, lat: -18.92160899 },
  { id: "n_687168429", name: "Amboniloha", source: "osm_neighbourhood", lon: 47.52552156, lat: -18.87009472 },
  { id: "n_5454040959", name: "Ambonisoa", source: "osm_neighbourhood", lon: 47.48313976, lat: -18.91263123 },
  { id: "n_13816663284", name: "Ambovavady", source: "osm_quarter", lon: 47.45478299, lat: -18.82248421 },
  { id: "n_9922907092", name: "Amoronakona", source: "osm_neighbourhood", lon: 47.60253084, lat: -18.93148687 },
  { id: "n_11923519763", name: "Amorondria", source: "osm_quarter", lon: 47.5462027, lat: -18.82809926 },
  { id: "n_681428134", name: "Ampahibe", source: "osm_suburb", lon: 47.53841209, lat: -18.90887071 },
  { id: "n_837197786", name: "Ampamantanana Androndrabe", source: "osm_suburb", lon: 47.53627296, lat: -18.94224228 },
  { id: "n_687191170", name: "Ampandrana", source: "osm_suburb", lon: 47.53399341, lat: -18.90366457 },
  { id: "n_688357084", name: "Ampandrana Atsinanana", source: "osm_suburb", lon: 47.53692895, lat: -18.90562191 },
  { id: "n_681428143", name: "Ampandrianomby", source: "osm_neighbourhood", lon: 47.54753748, lat: -18.90307965 },
  { id: "n_931752003", name: "Ampanefy", source: "osm_suburb", lon: 47.47885003, lat: -18.98364101 },
  { id: "n_12504002879", name: "Ampangabe", source: "osm_suburb", lon: 47.4994735, lat: -18.92660845 },
  { id: "n_5271851713", name: "Ampangabe", source: "osm_neighbourhood", lon: 47.55209545, lat: -18.84680409 },
  { id: "n_10559395465", name: "Ampanotokana", source: "osm_suburb", lon: 47.55731218, lat: -18.89971404 },
  { id: "n_617857577", name: "Amparibe", source: "osm_suburb", lon: 47.52596721, lat: -18.91598969 },
  { id: "n_617341774", name: "Ampasamadinika", source: "osm_neighbourhood", lon: 47.51979679, lat: -18.90919472 },
  { id: "n_681428140", name: "Ampasampito", source: "osm_suburb", lon: 47.54526642, lat: -18.89580164 },
  { id: "n_11224960455", name: "Ampasanimalo", source: "osm_neighbourhood", lon: 47.53998316, lat: -18.91557441 },
  { id: "n_681393191", name: "Ampasanisadoda", source: "osm_neighbourhood", lon: 47.53487229, lat: -18.91288903 },
  { id: "n_738247099", name: "Ampasika", source: "osm_neighbourhood", lon: 47.49715422, lat: -18.90954135 },
  { id: "n_663240591", name: "Ampatsakana", source: "osm_neighbourhood", lon: 47.51892113, lat: -18.91169867 },
  { id: "n_837558571", name: "Ampefiloha", source: "osm_suburb", lon: 47.51669827, lat: -18.91433939 },
  { id: "n_687168435", name: "Ampetsapetsa", source: "osm_neighbourhood", lon: 47.53265227, lat: -18.86362004 },
  { id: "n_687173783", name: "Ampitatafika", source: "osm_suburb", lon: 47.4787073, lat: -18.93761306 },
  { id: "n_574547485", name: "Analakely", source: "osm_suburb", lon: 47.52688455, lat: -18.90793337 },
  { id: "n_687168437", name: "Analamahitsy Cité", source: "osm_suburb", lon: 47.54786304, lat: -18.87117972 },
  { id: "n_5537450303", name: "Analamahitsy Tanàna", source: "osm_suburb", lon: 47.54940343, lat: -18.87692465 },
  { id: "n_686376932", name: "Anatihazo", source: "osm_suburb", lon: 47.51072214, lat: -18.9153845 },
  { id: "n_5271851714", name: "Andafiavaratra", source: "osm_suburb", lon: 47.54897484, lat: -18.85835428 },
  { id: "n_686366948", name: "Andavamamba", source: "osm_suburb", lon: 47.50904698, lat: -18.9187492 },
  { id: "n_623449903", name: "Andohalo", source: "osm_suburb", lon: 47.53114451, lat: -18.91795023 },
  { id: "n_12504457187", name: "Andohamandry", source: "osm_neighbourhood", lon: 47.53369918, lat: -18.93236929 },
  { id: "n_837540703", name: "Andohaniato", source: "osm_neighbourhood", lon: 47.56284339, lat: -18.92539976 },
  { id: "n_5680854298", name: "Andohanimandroseza", source: "osm_suburb", lon: 47.55228886, lat: -18.92467452 },
  { id: "n_687180725", name: "Andoharanofotsy", source: "osm_suburb", lon: 47.53437856, lat: -18.97854706 },
  { id: "n_5454111830", name: "Andohatanjona Itaosy", source: "osm_suburb", lon: 47.43517256, lat: -18.90353935 },
  { id: "n_686366965", name: "Andohatapenaka", source: "osm_suburb", lon: 47.49767641, lat: -18.90128737 },
  { id: "n_5271851711", name: "Andombotany", source: "osm_neighbourhood", lon: 47.55486258, lat: -18.84373363 },
  { id: "n_703740357", name: "Andraharo", source: "osm_suburb", lon: 47.5081891, lat: -18.88519559 },
  { id: "n_845962440", name: "Andrainarivo", source: "osm_neighbourhood", lon: 47.54446452, lat: -18.90869727 },
  { id: "n_694182857", name: "Andraisoro", source: "osm_suburb", lon: 47.55698736, lat: -18.90705029 },
  { id: "n_687180728", name: "Andralanitra", source: "osm_neighbourhood", lon: 47.57445936, lat: -18.90863096 },
  { id: "n_5531126586", name: "Andramahafoitra", source: "osm_neighbourhood", lon: 47.47319855, lat: -18.89570274 },
  { id: "n_5531126588", name: "Andramahavola", source: "osm_suburb", lon: 47.47289055, lat: -18.90245039 },
  { id: "n_837197783", name: "Andrangaranga", source: "osm_neighbourhood", lon: 47.53786848, lat: -18.93748274 },
  { id: "n_687164483", name: "Andranobevava", source: "osm_neighbourhood", lon: 47.541117, lat: -18.88091887 },
  { id: "n_12504457183", name: "Andranomanalina", source: "osm_suburb", lon: 47.51147487, lat: -18.91036882 },
  { id: "n_668739137", name: "Andranomena", source: "osm_suburb", lon: 47.4804261, lat: -18.85085569 },
  { id: "n_5271851712", name: "Andranomena", source: "osm_neighbourhood", lon: 47.55892765, lat: -18.84851056 },
  { id: "n_5454040957", name: "Andranonahoatra", source: "osm_suburb", lon: 47.47469008, lat: -18.91583352 },
  { id: "n_668739132", name: "Andranoro", source: "osm_suburb", lon: 47.47237674, lat: -18.86405246 },
  { id: "n_681137746", name: "Andranovory", source: "osm_neighbourhood", lon: 47.57228611, lat: -18.92498342 },
  { id: "n_5414315205", name: "Andravako", source: "osm_neighbourhood", lon: 47.46341732, lat: -18.89227919 },
  { id: "n_687191160", name: "Andravoahangy", source: "osm_suburb", lon: 47.53026807, lat: -18.89868134 },
  { id: "n_686271702", name: "Andrefan'Ambohijanahary", source: "osm_suburb", lon: 47.52036462, lat: -18.92293469 },
  { id: "n_5316748707", name: "Andrefantsena", source: "osm_suburb", lon: 47.55447795, lat: -18.83731019 },
  { id: "n_687168433", name: "Androhibe", source: "osm_suburb", lon: 47.54064713, lat: -18.86484774 },
  { id: "n_686378280", name: "Androndrakely", source: "osm_suburb", lon: 47.53210165, lat: -18.94717739 },
  { id: "n_697186988", name: "Andrononobe", source: "osm_suburb", lon: 47.55251101, lat: -18.86791545 },
  { id: "n_837191410", name: "Angarangarana", source: "osm_suburb", lon: 47.5090765, lat: -18.93503979 },
  { id: "n_13816663283", name: "Angodongodona", source: "osm_quarter", lon: 47.4308415, lat: -18.8229388 },
  { id: "n_687164484", name: "Anjanahary", source: "osm_suburb", lon: 47.53719075, lat: -18.89530881 },
  { id: "n_931486397", name: "Anjanatsimiova", source: "osm_neighbourhood", lon: 47.47283268, lat: -18.93938673 },
  { id: "rel_17812937", name: "Anjeva Gara", source: "osm_admin", lon: 47.61904136, lat: -18.92375112 },
  { id: "n_681393209", name: "Anjohy", source: "osm_neighbourhood", lon: 47.5337297, lat: -18.9181703 },
  { id: "n_12504457169", name: "Ankadiaivo", source: "osm_neighbourhood", lon: 47.54969203, lat: -18.95067264 },
  { id: "n_681227159", name: "Ankadifotsy", source: "osm_suburb", lon: 47.52590848, lat: -18.8966988 },
  { id: "n_5143429980", name: "Ankadikely", source: "osm_suburb", lon: 47.55349063, lat: -18.85106042 },
  { id: "n_12504457166", name: "Ankadilalampotsy", source: "osm_suburb", lon: 47.53744766, lat: -18.97204075 },
  { id: "n_694051796", name: "Ankadilalana", source: "osm_suburb", lon: 47.52872495, lat: -18.9249218 },
  { id: "n_686271703", name: "Ankadimbahoaka", source: "osm_suburb", lon: 47.52327312, lat: -18.94384175 },
  { id: "rel_17812936", name: "Ankadinandriana", source: "osm_admin", lon: 47.61922376, lat: -19.05428207 },
  { id: "n_5592523471", name: "Ankadinandriana", source: "osm_suburb", lon: 47.54758827, lat: -18.96909958 },
  { id: "n_687164486", name: "Ankadindramamy", source: "osm_quarter", lon: 47.55924746, lat: -18.89147146 },
  { id: "n_681393181", name: "Ankadindratombo", source: "osm_suburb", lon: 47.55654096, lat: -18.94138133 },
  { id: "n_12504457175", name: "Ankadindravola Ivato", source: "osm_suburb", lon: 47.48580439, lat: -18.82549791 },
  { id: "n_5416457563", name: "Ankadirano", source: "osm_neighbourhood", lon: 47.50492875, lat: -18.97854497 },
  { id: "n_931486387", name: "Ankaditany", source: "osm_suburb", lon: 47.47057408, lat: -18.95049423 },
  { id: "n_12504457180", name: "Ankaditapaka", source: "osm_neighbourhood", lon: 47.52353273, lat: -18.89976699 },
  { id: "n_686159724", name: "Ankaditoho", source: "osm_suburb", lon: 47.52972904, lat: -18.94054635 },
  { id: "n_681393255", name: "Ankadivato", source: "osm_suburb", lon: 47.53418515, lat: -18.90885763 },
  { id: "n_931752004", name: "Ankadivoribe", source: "osm_suburb", lon: 47.46984266, lat: -19.03066211 },
  { id: "n_837200474", name: "Ankadivory", source: "osm_neighbourhood", lon: 47.54789608, lat: -18.92866733 },
  { id: "n_8862550402", name: "Ankandrina", source: "osm_neighbourhood", lon: 47.56306752, lat: -18.88531725 },
  { id: "n_686366969", name: "Ankasina", source: "osm_neighbourhood", lon: 47.50411408, lat: -18.89624969 },
  { id: "n_13337796213", name: "Ankatso", source: "osm_suburb", lon: 47.5513246, lat: -18.9156378 },
  { id: "n_12504457170", name: "Ankazobe", source: "osm_neighbourhood", lon: 47.58501086, lat: -18.94135316 },
  { id: "n_845947786", name: "Ankazolava", source: "osm_neighbourhood", lon: 47.54147327, lat: -18.94606639 },
  { id: "n_690711883", name: "Ankazomanga", source: "osm_suburb", lon: 47.51132285, lat: -18.89170399 },
  { id: "rel_7797863", name: "Ankazotoho", source: "osm_admin", lon: 47.49807139, lat: -18.94497009 },
  { id: "n_681393197", name: "Ankazotokana", source: "osm_suburb", lon: 47.53613399, lat: -18.91769281 },
  { id: "n_2724829809", name: "Ankeniheny", source: "osm_suburb", lon: 47.52200575, lat: -18.95309148 },
  { id: "n_5552401830", name: "Ankerakely", source: "osm_neighbourhood", lon: 47.53584395, lat: -18.92767016 },
  { id: "n_687164481", name: "Ankerana", source: "osm_suburb", lon: 47.55535331, lat: -18.88639439 },
  { id: "n_688357090", name: "Ankorahotra", source: "osm_suburb", lon: 47.53719139, lat: -18.91433992 },
  { id: "n_13462289220", name: "Ankoroby", source: "osm_neighbourhood", lon: 47.46853338, lat: -18.93250874 },
  { id: "n_844529035", name: "Ankorondrano", source: "osm_suburb", lon: 47.52297701, lat: -18.88518871 },
  { id: "n_686376916", name: "Anosibe", source: "osm_suburb", lon: 47.51411695, lat: -18.92340272 },
  { id: "n_5454040967", name: "Anosimasina", source: "osm_suburb", lon: 47.49306327, lat: -18.9138355 },
  { id: "n_9878925459", name: "Anosipatrana", source: "osm_suburb", lon: 47.49439222, lat: -18.92976447 },
  { id: "n_12504457178", name: "Anosisoa", source: "osm_suburb", lon: 47.4918559, lat: -18.87014843 },
  { id: "n_668739151", name: "Anosivavaka", source: "osm_suburb", lon: 47.50932389, lat: -18.87338286 },
  { id: "w_359369846", name: "Anosivavaka", source: "osm_neighbourhood", lon: 47.50956003, lat: -18.87666536 },
  { id: "n_686376924", name: "Anosizato Andrefana", source: "osm_suburb", lon: 47.49581144, lat: -18.9392337 },
  { id: "n_728268650", name: "Anosizato Atsinanana", source: "osm_suburb", lon: 47.50243126, lat: -18.93833337 },
  { id: "n_837558566", name: "Anosy", source: "osm_suburb", lon: 47.51907887, lat: -18.91763976 },
  { id: "n_5281966844", name: "Antalata", source: "osm_suburb", lon: 47.50258777, lat: -18.98386187 },
  { id: "rel_7763796", name: "Antananambony", source: "osm_admin", lon: 47.49741666, lat: -18.9394194 },
  { id: "n_5271851715", name: "Antanandrano", source: "osm_suburb", lon: 47.53503502, lat: -18.85195111 },
  { id: "rel_7763924", name: "Antandrokomby", source: "osm_admin", lon: 47.49029463, lat: -18.94132598 },
  { id: "n_5454040950", name: "Antandrokomby", source: "osm_neighbourhood", lon: 47.49079314, lat: -18.9056751 },
  { id: "n_668739139", name: "Antanety", source: "osm_suburb", lon: 47.49912499, lat: -18.87249244 },
  { id: "n_5271851716", name: "Antanety Atsimo", source: "osm_neighbourhood", lon: 47.54736832, lat: -18.8515261 },
  { id: "n_5271851717", name: "Antanety Avaratra", source: "osm_neighbourhood", lon: 47.54502433, lat: -18.84621189 },
  { id: "n_843310804", name: "Antanimena", source: "osm_suburb", lon: 47.52021667, lat: -18.89678933 },
  { id: "n_574646963", name: "Antaninarenina", source: "osm_suburb", lon: 47.52538879, lat: -18.91031564 },
  { id: "n_668739152", name: "Antanjombe", source: "osm_suburb", lon: 47.50609101, lat: -18.86798459 },
  { id: "n_13462289214", name: "Antanjona", source: "osm_quarter", lon: 47.45425837, lat: -18.91933393 },
  { id: "n_690711890", name: "Antohomadinika", source: "osm_suburb", lon: 47.51599984, lat: -18.90395748 },
  { id: "n_11224960454", name: "Antsahabe", source: "osm_neighbourhood", lon: 47.53337603, lat: -18.91467879 },
  { id: "n_5531126585", name: "Antsahakely", source: "osm_neighbourhood", lon: 47.48092599, lat: -18.88784804 },
  { id: "n_5271851704", name: "Antsahamaina", source: "osm_neighbourhood", lon: 47.55393452, lat: -18.86041915 },
  { id: "n_686539609", name: "Antsahamamy", source: "osm_neighbourhood", lon: 47.55767521, lat: -18.9165528 },
  { id: "n_7149685720", name: "Antsahamarofoza", source: "osm_suburb", lon: 47.6046509, lat: -18.83799472 },
  { id: "n_5680854299", name: "Antsahameva", source: "osm_neighbourhood", lon: 47.55016, lat: -18.90963462 },
  { id: "n_10567187961", name: "Antsahasoa", source: "osm_suburb", lon: 47.53463129, lat: -18.96503057 },
  { id: "n_7149685730", name: "Antsahatsiresy", source: "osm_suburb", lon: 47.56362755, lat: -18.82636299 },
  { id: "n_9758897058", name: "Antsahavola", source: "osm_neighbourhood", lon: 47.52230347, lat: -18.9090229 },
  { id: "n_668739136", name: "Antsahavolakely", source: "osm_neighbourhood", lon: 47.49694455, lat: -18.85191753 },
  { id: "n_688357091", name: "Antsakaviro", source: "osm_suburb", lon: 47.53663187, lat: -18.91150027 },
  { id: "n_837558569", name: "Antsalovana", source: "osm_neighbourhood", lon: 47.51334708, lat: -18.89816422 },
  { id: "n_12504457172", name: "Antsampandrano", source: "osm_suburb", lon: 47.58137492, lat: -18.84828288 },
  { id: "n_681137748", name: "Antsobolo", source: "osm_neighbourhood", lon: 47.56879992, lat: -18.91267332 },
  { id: "n_5538613938", name: "Antsofinondry", source: "osm_suburb", lon: 47.55740936, lat: -18.82793149 },
  { id: "n_12066924735", name: "Atendro", source: "osm_suburb", lon: 47.55103452, lat: -18.82284252 },
  { id: "n_931486395", name: "Atsimombohitra", source: "osm_suburb", lon: 47.4779925, lat: -18.94271495 },
  { id: "n_5316748706", name: "Atsinanantsena", source: "osm_suburb", lon: 47.55764219, lat: -18.83687293 },
  { id: "n_5454040948", name: "Atsinanantsena Ambohidrapeto", source: "osm_suburb", lon: 47.47801434, lat: -18.90451619 },
  { id: "n_687173779", name: "Avarabohitra", source: "osm_suburb", lon: 47.47912994, lat: -18.92508804 },
  { id: "n_681428137", name: "Avaradoha", source: "osm_suburb", lon: 47.54400446, lat: -18.90017377 },
  { id: "n_668739129", name: "Avaratanàna", source: "osm_suburb", lon: 47.48537735, lat: -18.83953232 },
  { id: "n_10568170733", name: "Avaratetezana", source: "osm_suburb", lon: 47.48652291, lat: -18.86055698 },
  { id: "n_728268649", name: "Avaratetezana", source: "osm_suburb", lon: 47.4822914, lat: -18.93560127 },
  { id: "n_681428157", name: "Avaratr'Antanimora", source: "osm_suburb", lon: 47.54296344, lat: -18.91367917 },
  { id: "n_5454040952", name: "Avaratsena Ambohidrapeto", source: "osm_suburb", lon: 47.47296884, lat: -18.9079402 },
  { id: "n_5454040956", name: "Behenjy", source: "osm_neighbourhood", lon: 47.47026332, lat: -18.9113583 },
  { id: "n_837567373", name: "Behoririka", source: "osm_suburb", lon: 47.52629659, lat: -18.90204907 },
  { id: "n_686366959", name: "Bekiraro", source: "osm_neighbourhood", lon: 47.51431315, lat: -18.9078555 },
  { id: "n_11224960453", name: "Bel'air", source: "osm_neighbourhood", lon: 47.53271964, lat: -18.90643224 },
  { id: "n_4206843240", name: "Belanitra", source: "osm_suburb", lon: 47.52223664, lat: -18.83985525 },
  { id: "n_5454040966", name: "Bemasoandro", source: "osm_suburb", lon: 47.48670853, lat: -18.91396644 },
  { id: "n_688379376", name: "Besarety", source: "osm_suburb", lon: 47.53615166, lat: -18.90155065 },
  { id: "n_668739140", name: "Betafo", source: "osm_suburb", lon: 47.5022086, lat: -18.87836075 },
  { id: "n_681428130", name: "Betongolo", source: "osm_suburb", lon: 47.54021701, lat: -18.90520997 },
  { id: "n_687180724", name: "Bevalala", source: "osm_neighbourhood", lon: 47.51630032, lat: -18.97813772 },
  { id: "n_5680854873", name: "Bibilava", source: "osm_neighbourhood", lon: 47.56454737, lat: -18.91666885 },
  { id: "w_148444594", name: "Building cité Perrier", source: "osm_neighbourhood", lon: 47.53054391, lat: -18.90326552 },
  { id: "n_5454040953", name: "Cité Itaosy Akany Sambatra", source: "osm_suburb", lon: 47.47855265, lat: -18.90957116 },
  { id: "n_9735006975", name: "Cité militaire", source: "osm_locality", lon: 47.55276182, lat: -18.89058441 },
  { id: "n_688359813", name: "Cité Planton", source: "osm_neighbourhood", lon: 47.54078478, lat: -18.90910746 },
  { id: "n_687173785", name: "Faliarivo", source: "osm_suburb", lon: 47.46037908, lat: -18.94790424 },
  { id: "n_13462289226", name: "Faliarivo II", source: "osm_suburb", lon: 47.47306034, lat: -18.93179439 },
  { id: "n_12062920445", name: "Famatanantsoa", source: "osm_locality", lon: 47.53125919, lat: -18.87129809 },
  { id: "n_686545015", name: "Faravohitra", source: "osm_suburb", lon: 47.52972315, lat: -18.90851791 },
  { id: "n_12504002878", name: "Fasan'ny Karàna", source: "osm_neighbourhood", lon: 47.51381108, lat: -18.94889738 },
  { id: "n_837197788", name: "Fenomanana", source: "osm_neighbourhood", lon: 47.54231536, lat: -18.93313971 },
  { id: "rel_17812946", name: "Fiadanana", source: "osm_admin", lon: 47.426542, lat: -18.89690327 },
  { id: "n_837191897", name: "Fiadanana", source: "osm_suburb", lon: 47.52444488, lat: -18.93346357 },
  { id: "n_5531126582", name: "Fiombonana", source: "osm_neighbourhood", lon: 47.47660061, lat: -18.8955481 },
  { id: "n_6313190685", name: "Fokontany Manankasina", source: "osm_quarter", lon: 47.48663217, lat: -19.08217245 },
  { id: "n_5680854869", name: "Fort Duchesne", source: "osm_neighbourhood", lon: 47.54696799, lat: -18.91289368 },
  { id: "n_6673050118", name: "Golan", source: "osm_neighbourhood", lon: 47.4909982, lat: -18.87319168 },
  { id: "n_12504457188", name: "Haute Ville", source: "osm_suburb", lon: 47.53101604, lat: -18.92693771 },
  { id: "n_687164487", name: "Iadiambola", source: "osm_neighbourhood", lon: 47.54918623, lat: -18.89354143 },
  { id: "rel_17812949", name: "Iarinarivo", source: "osm_admin", lon: 47.42554808, lat: -18.84544635 },
  { id: "n_687180731", name: "Iavoloha", source: "osm_suburb", lon: 47.53852348, lat: -19.01774482 },
  { id: "n_12504457167", name: "Ifarihy", source: "osm_suburb", lon: 47.54769901, lat: -18.9610491 },
  { id: "n_12504457174", name: "Ikianja", source: "osm_suburb", lon: 47.59511234, lat: -18.90805904 },
  { id: "n_12504457173", name: "Ilafy", source: "osm_suburb", lon: 47.56585884, lat: -18.85444388 },
  { id: "n_686376928", name: "Ilanivato", source: "osm_suburb", lon: 47.49979963, lat: -18.92203463 },
  { id: "n_12506457104", name: "Imerimanjaka", source: "osm_suburb", lon: 47.55017358, lat: -18.97864176 },
  { id: "n_672735040", name: "Imerinafovoany", source: "osm_suburb", lon: 47.46807633, lat: -18.84004877 },
  { id: "n_931752002", name: "Isaingy", source: "osm_suburb", lon: 47.49641038, lat: -18.96929286 },
  { id: "n_620027471", name: "Isoraka", source: "osm_suburb", lon: 47.52119441, lat: -18.91306207 },
  { id: "n_574265718", name: "Isotry", source: "osm_suburb", lon: 47.51641297, lat: -18.90973958 },
  { id: "n_687175200", name: "Itaosy", source: "osm_suburb", lon: 47.47058585, lat: -18.91784076 },
  { id: "n_687168428", name: "Ivandry", source: "osm_suburb", lon: 47.52331803, lat: -18.8775244 },
  { id: "n_12504457184", name: "Ivolaniray", source: "osm_neighbourhood", lon: 47.50611264, lat: -18.92745451 },
  { id: "n_686271708", name: "Madera Namontana", source: "osm_suburb", lon: 47.51806961, lat: -18.93728804 },
  { id: "n_12506457106", name: "Mahabo", source: "osm_suburb", lon: 47.53620993, lat: -18.98674349 },
  { id: "n_12504457164", name: "Mahalavolona", source: "osm_suburb", lon: 47.5242771, lat: -18.98994557 },
  { id: "n_574551024", name: "Mahamasina", source: "osm_suburb", lon: 47.52435377, lat: -18.91861966 },
  { id: "n_12504002876", name: "Mahamasina Atsimo", source: "osm_neighbourhood", lon: 47.52514576, lat: -18.92312314 },
  { id: "n_687168427", name: "Mahatony", source: "osm_neighbourhood", lon: 47.52564666, lat: -18.86165688 },
  { id: "n_3682650472", name: "Mahatsara", source: "osm_neighbourhood", lon: 47.60344315, lat: -18.88135955 },
  { id: "n_687191168", name: "Mahavoky", source: "osm_neighbourhood", lon: 47.53430338, lat: -18.89935567 },
  { id: "n_687164485", name: "Mahazo", source: "osm_neighbourhood", lon: 47.5621991, lat: -18.89539419 },
  { id: "n_686378306", name: "Mahazoarivo", source: "osm_suburb", lon: 47.54693567, lat: -18.94000206 },
  { id: "n_7184912074", name: "Maibahoaka", source: "osm_suburb", lon: 47.4607621, lat: -18.82938102 },
  { id: "n_12504457165", name: "Malaho", source: "osm_suburb", lon: 47.50930502, lat: -18.97195743 },
  { id: "n_687173775", name: "Malaza", source: "osm_suburb", lon: 47.43429954, lat: -18.95525879 },
  { id: "n_687180730", name: "Malaza", source: "osm_neighbourhood", lon: 47.52910699, lat: -18.9718258 },
  { id: "n_845962439", name: "Manakambahiny", source: "osm_suburb", lon: 47.53752661, lat: -18.93112851 },
  { id: "n_13462289223", name: "Manampisoa", source: "osm_suburb", lon: 47.46169964, lat: -18.93290578 },
  { id: "n_9526189873", name: "Manandona", source: "osm_neighbourhood", lon: 47.55074708, lat: -18.99237257 },
  { id: "n_837191898", name: "Mananjara", source: "osm_suburb", lon: 47.52310924, lat: -18.92884128 },
  { id: "n_12504457182", name: "Manarintsoa", source: "osm_suburb", lon: 47.51357984, lat: -18.91324155 },
  { id: "n_7149685724", name: "Manarintsoa Namehana", source: "osm_suburb", lon: 47.53877553, lat: -18.82694851 },
  { id: "n_837190450", name: "Mandrangobato", source: "osm_suburb", lon: 47.51152635, lat: -18.92896422 },
  { id: "n_637715766", name: "Mandriambero", source: "osm_suburb", lon: 47.43478476, lat: -18.83411318 },
  { id: "n_686378314", name: "Mandroseza", source: "osm_suburb", lon: 47.5514328, lat: -18.93379966 },
  { id: "n_687191164", name: "Mandrosoa", source: "osm_neighbourhood", lon: 47.5290647, lat: -18.91047062 },
  { id: "n_923872934", name: "Mandrosoa", source: "osm_suburb", lon: 47.56093453, lat: -18.87143177 },
  { id: "n_7798554173", name: "Mandrosoa Ivato", source: "osm_suburb", lon: 47.47157285, lat: -18.82553218 },
  { id: "n_13462289209", name: "Mangarivotra", source: "osm_quarter", lon: 47.46396568, lat: -18.9230128 },
  { id: "n_686545016", name: "Mangarivotra", source: "osm_neighbourhood", lon: 47.53207019, lat: -18.91037506 },
  { id: "n_687168432", name: "Manjaka Ilafy", source: "osm_suburb", lon: 47.55918731, lat: -18.86001886 },
  { id: "n_687168439", name: "Manjakaray", source: "osm_suburb", lon: 47.53251732, lat: -18.88904562 },
  { id: "n_5531126580", name: "Marobiby", source: "osm_suburb", lon: 47.48033783, lat: -18.8956876 },
  { id: "n_686159725", name: "Marohoho", source: "osm_neighbourhood", lon: 47.53372052, lat: -18.93654356 },
  { id: "n_687191161", name: "Mascar", source: "osm_suburb", lon: 47.53286728, lat: -18.89584617 },
  { id: "n_7149685718", name: "Masinandriana", source: "osm_suburb", lon: 47.5671703, lat: -18.87837279 },
  { id: "n_12504002877", name: "Miadana", source: "osm_neighbourhood", lon: 47.5097106, lat: -18.94230708 },
  { id: "n_12504457168", name: "Miadana", source: "osm_neighbourhood", lon: 47.59194309, lat: -18.96455142 },
  { id: "n_9758912238", name: "Miandrarivo", source: "osm_neighbourhood", lon: 47.5372013, lat: -18.92472498 },
  { id: "n_13462289222", name: "Morarano", source: "osm_neighbourhood", lon: 47.45780961, lat: -18.93581376 },
  { id: "n_837197782", name: "Morarano", source: "osm_suburb", lon: 47.54026476, lat: -18.93523058 },
  { id: "n_668739131", name: "Morondava", source: "osm_suburb", lon: 47.46544831, lat: -18.85314235 },
  { id: "n_7149685729", name: "Namehana", source: "osm_suburb", lon: 47.54237553, lat: -18.83182217 },
  { id: "n_681434750", name: "Nanisana", source: "osm_suburb", lon: 47.54839562, lat: -18.88810006 },
  { id: "n_12504457185", name: "Ouest Mananjara", source: "osm_suburb", lon: 47.51699648, lat: -18.93240926 },
  { id: "n_4371790027", name: "Presidential Place", source: "osm_locality", lon: 47.52376151, lat: -18.91236414 },
  { id: "n_5531126579", name: "Sakanambazo", source: "osm_neighbourhood", lon: 47.48489003, lat: -18.8997717 },
  { id: "n_12061261553", name: "Saropody", source: "osm_neighbourhood", lon: 47.53745086, lat: -18.95359941 },
  { id: "n_5271851709", name: "Seranina", source: "osm_neighbourhood", lon: 47.53922175, lat: -18.83993068 },
  { id: "n_687164488", name: "Soamanandrariny", source: "osm_suburb", lon: 47.5670229, lat: -18.89024504 },
  { id: "n_7149685731", name: "Soaniadanana", source: "osm_suburb", lon: 47.5620144, lat: -18.84159805 },
  { id: "n_686271697", name: "Soanierana", source: "osm_suburb", lon: 47.52391421, lat: -18.93838268 },
  { id: "n_837567376", name: "Soarano", source: "osm_suburb", lon: 47.52118296, lat: -18.90325226 },
  { id: "n_687168430", name: "Soavimasoandro", source: "osm_suburb", lon: 47.51451404, lat: -18.85551482 },
  { id: "n_681434761", name: "Soavimbahoaka", source: "osm_neighbourhood", lon: 47.54189322, lat: -18.89138189 },
  { id: "n_931752010", name: "Soavina", source: "osm_suburb", lon: 47.50252857, lat: -18.95837576 },
  { id: "n_12504457192", name: "Soavinandriana", source: "osm_neighbourhood", lon: 47.5409755, lat: -18.89743545 },
  { id: "n_672735082", name: "Talatamaty", source: "osm_suburb", lon: 47.45050513, lat: -18.84341657 },
  { id: "n_687173781", name: "Tangaina", source: "osm_neighbourhood", lon: 47.4860392, lat: -18.94507051 },
  { id: "n_687180729", name: "Tanjombato", source: "osm_suburb", lon: 47.52701684, lat: -18.95874513 },
  { id: "n_694218753", name: "Tongarivo", source: "osm_suburb", lon: 47.52371587, lat: -18.96621786 },
  { id: "n_5316748705", name: "Tsarafara", source: "osm_suburb", lon: 47.5649075, lat: -18.83591265 },
  { id: "n_681393166", name: "Tsarafaritra Tsimbazaza", source: "osm_suburb", lon: 47.5289058, lat: -18.93468323 },
  { id: "n_5680854207", name: "Tsarahonenana", source: "osm_suburb", lon: 47.5512819, lat: -18.90365164 },
  { id: "n_574539686", name: "Tsaralalàna", source: "osm_suburb", lon: 47.5198171, lat: -18.9063838 },
  { id: "n_844529031", name: "Tsaramasay", source: "osm_neighbourhood", lon: 47.51734801, lat: -18.89045031 },
  { id: "n_13462289210", name: "Tsararay Lailava", source: "osm_suburb", lon: 47.46093732, lat: -18.92480413 },
  { id: "n_11987385329", name: "Tsararivotra", source: "osm_neighbourhood", lon: 47.57312617, lat: -19.06310491 },
  { id: "n_687168431", name: "Tsarasaotra", source: "osm_neighbourhood", lon: 47.51487695, lat: -18.86768807 },
  { id: "n_681400105", name: "Tsiadana", source: "osm_suburb", lon: 47.54534094, lat: -18.91843925 },
  { id: "n_12506457103", name: "Tsilazaina", source: "osm_neighbourhood", lon: 47.59114034, lat: -19.00102737 },
  { id: "n_12504002874", name: "Tsimialonjafy", source: "osm_neighbourhood", lon: 47.52915443, lat: -18.91927169 },
  { id: "n_6782874587", name: "Village Akamasoa", source: "osm_neighbourhood", lon: 47.5787167, lat: -18.89240186 },
  { id: "n_13462289227", name: "Vinany", source: "osm_suburb", lon: 47.47159123, lat: -18.92691525 },
  { id: "n_681393224", name: "Volosarika", source: "osm_neighbourhood", lon: 47.53920996, lat: -18.92157817 },
  { id: "n_12509205379", name: "Volotara", source: "osm_suburb", lon: 47.52456434, lat: -18.97808425 },
  { id: "n_5531126581", name: "Vonelina", source: "osm_neighbourhood", lon: 47.47266386, lat: -18.88500079 },
]

export const quartiersById: Readonly<Record<string, Quartier>> = {
  "n_837558568": {
    "id": "n_837558568",
    "name": "67 ha",
    "source": "osm_suburb",
    "lon": 47.5084707,
    "lat": -18.90518273
  },
  "n_725856151": {
    "id": "n_725856151",
    "name": "67 ha Atsimo",
    "source": "osm_neighbourhood",
    "lon": 47.50602225,
    "lat": -18.90985853
  },
  "n_837558567": {
    "id": "n_837558567",
    "name": "67 ha Avaratra Andrefana",
    "source": "osm_neighbourhood",
    "lon": 47.50591572,
    "lat": -18.90301144
  },
  "n_12504457186": {
    "id": "n_12504457186",
    "name": "67 ha Avaratra Atsinanana",
    "source": "osm_neighbourhood",
    "lon": 47.51193316,
    "lat": -18.90255286
  },
  "n_12062907602": {
    "id": "n_12062907602",
    "name": "Akany Marisa",
    "source": "osm_locality",
    "lon": 47.52158466,
    "lat": -18.86688795
  },
  "n_687168436": {
    "id": "n_687168436",
    "name": "Alarobia",
    "source": "osm_suburb",
    "lon": 47.51847491,
    "lat": -18.87290438
  },
  "n_687180726": {
    "id": "n_687180726",
    "name": "Alasora",
    "source": "osm_suburb",
    "lon": 47.56509556,
    "lat": -18.95516895
  },
  "n_5454040963": {
    "id": "n_5454040963",
    "name": "Ambaniala",
    "source": "osm_suburb",
    "lon": 47.48923688,
    "lat": -18.9213059
  },
  "n_5680854302": {
    "id": "n_5680854302",
    "name": "Ambanidia",
    "source": "osm_suburb",
    "lon": 47.53962061,
    "lat": -18.91873985
  },
  "n_5454040949": {
    "id": "n_5454040949",
    "name": "Ambanilalana",
    "source": "osm_suburb",
    "lon": 47.48088191,
    "lat": -18.91864982
  },
  "rel_7772751": {
    "id": "rel_7772751",
    "name": "Ambanimaso",
    "source": "osm_admin",
    "lon": 47.4944255,
    "lat": -18.93987173
  },
  "n_12504002875": {
    "id": "n_12504002875",
    "name": "Ambanin'Ampamarinana",
    "source": "osm_neighbourhood",
    "lon": 47.5291669,
    "lat": -18.92173285
  },
  "n_688357092": {
    "id": "n_688357092",
    "name": "Ambaranjana",
    "source": "osm_neighbourhood",
    "lon": 47.54042852,
    "lat": -18.91176056
  },
  "n_5535778698": {
    "id": "n_5535778698",
    "name": "Ambato",
    "source": "osm_neighbourhood",
    "lon": 47.48902405,
    "lat": -18.89220844
  },
  "n_573536052": {
    "id": "n_573536052",
    "name": "Ambatobe",
    "source": "osm_suburb",
    "lon": 47.55707441,
    "lat": -18.87929528
  },
  "rel_17812935": {
    "id": "rel_17812935",
    "name": "Ambatofahavalo",
    "source": "osm_admin",
    "lon": 47.61291282,
    "lat": -19.08599661
  },
  "n_7149564249": {
    "id": "n_7149564249",
    "name": "Ambatofotsy Avaradrano",
    "source": "osm_suburb",
    "lon": 47.57685389,
    "lat": -18.82723901
  },
  "n_9112918006": {
    "id": "n_9112918006",
    "name": "Ambatokaranana",
    "source": "osm_neighbourhood",
    "lon": 47.54850365,
    "lat": -18.8979361
  },
  "n_4046331598": {
    "id": "n_4046331598",
    "name": "Ambatolampy",
    "source": "osm_neighbourhood",
    "lon": 47.44676236,
    "lat": -18.88710091
  },
  "n_668739128": {
    "id": "n_668739128",
    "name": "Ambatolampy Antehiroka",
    "source": "osm_suburb",
    "lon": 47.49224943,
    "lat": -18.84559322
  },
  "n_12504457193": {
    "id": "n_12504457193",
    "name": "Ambatomainty",
    "source": "osm_suburb",
    "lon": 47.53755784,
    "lat": -18.89039364
  },
  "n_681137790": {
    "id": "n_681137790",
    "name": "Ambatomaro",
    "source": "osm_suburb",
    "lon": 47.56415435,
    "lat": -18.90246323
  },
  "n_12504457190": {
    "id": "n_12504457190",
    "name": "Ambatomena",
    "source": "osm_neighbourhood",
    "lon": 47.52383117,
    "lat": -18.90801937
  },
  "n_686543334": {
    "id": "n_686543334",
    "name": "Ambatonakanga",
    "source": "osm_neighbourhood",
    "lon": 47.52735343,
    "lat": -18.91308797
  },
  "n_13462289224": {
    "id": "n_13462289224",
    "name": "Ambatondratemo",
    "source": "osm_neighbourhood",
    "lon": 47.47686327,
    "lat": -18.92973947
  },
  "n_7122857438": {
    "id": "n_7122857438",
    "name": "Ambatonilita",
    "source": "osm_neighbourhood",
    "lon": 47.52187056,
    "lat": -18.91092789
  },
  "n_694070647": {
    "id": "n_694070647",
    "name": "Ambatoroka",
    "source": "osm_suburb",
    "lon": 47.54195637,
    "lat": -18.92426728
  },
  "n_12504002880": {
    "id": "n_12504002880",
    "name": "Ambatoroka Ambany",
    "source": "osm_neighbourhood",
    "lon": 47.54675968,
    "lat": -18.92326257
  },
  "n_686543332": {
    "id": "n_686543332",
    "name": "Ambatovinaky",
    "source": "osm_neighbourhood",
    "lon": 47.52977717,
    "lat": -18.91484838
  },
  "n_686542283": {
    "id": "n_686542283",
    "name": "Ambavahadimitafo",
    "source": "osm_neighbourhood",
    "lon": 47.53404888,
    "lat": -18.92146504
  },
  "n_931540836": {
    "id": "n_931540836",
    "name": "Ambavahaditokana",
    "source": "osm_suburb",
    "lon": 47.46183493,
    "lat": -18.92361871
  },
  "n_13462289211": {
    "id": "n_13462289211",
    "name": "Ambavahaditokana Afovoany",
    "source": "osm_quarter",
    "lon": 47.46152596,
    "lat": -18.92654019
  },
  "n_13462289212": {
    "id": "n_13462289212",
    "name": "Ambavahaditokana Andrefana",
    "source": "osm_quarter",
    "lon": 47.45954521,
    "lat": -18.9268326
  },
  "n_13462289216": {
    "id": "n_13462289216",
    "name": "Ambavahaditokana Atsimo",
    "source": "osm_quarter",
    "lon": 47.45914308,
    "lat": -18.92949623
  },
  "n_6830616464": {
    "id": "n_6830616464",
    "name": "Ambilanibe",
    "source": "osm_neighbourhood",
    "lon": 47.5048191,
    "lat": -18.91995853
  },
  "n_5454040955": {
    "id": "n_5454040955",
    "name": "Amboatavo",
    "source": "osm_suburb",
    "lon": 47.46600574,
    "lat": -18.91943684
  },
  "n_668739134": {
    "id": "n_668739134",
    "name": "Amboavahy",
    "source": "osm_suburb",
    "lon": 47.48113277,
    "lat": -18.85811931
  },
  "n_931486392": {
    "id": "n_931486392",
    "name": "Ambodavena",
    "source": "osm_neighbourhood",
    "lon": 47.47685296,
    "lat": -18.94782383
  },
  "n_687173784": {
    "id": "n_687173784",
    "name": "Ambodiafontsy",
    "source": "osm_suburb",
    "lon": 47.46373938,
    "lat": -18.94090725
  },
  "n_5454040965": {
    "id": "n_5454040965",
    "name": "Ambodiamberivatry",
    "source": "osm_suburb",
    "lon": 47.4857253,
    "lat": -18.90789744
  },
  "n_5454040951": {
    "id": "n_5454040951",
    "name": "Ambodiampanga Itaosy",
    "source": "osm_neighbourhood",
    "lon": 47.48321533,
    "lat": -18.90456079
  },
  "n_5454111829": {
    "id": "n_5454111829",
    "name": "Ambodifasika",
    "source": "osm_suburb",
    "lon": 47.46158495,
    "lat": -18.90985632
  },
  "n_12504457191": {
    "id": "n_12504457191",
    "name": "Ambodifilao",
    "source": "osm_neighbourhood",
    "lon": 47.52604872,
    "lat": -18.90518133
  },
  "n_668739138": {
    "id": "n_668739138",
    "name": "Ambodihady",
    "source": "osm_suburb",
    "lon": 47.48088636,
    "lat": -18.8757591
  },
  "n_6673192563": {
    "id": "n_6673192563",
    "name": "Ambodihady Carriere",
    "source": "osm_neighbourhood",
    "lon": 47.48982885,
    "lat": -18.88014795
  },
  "n_687191167": {
    "id": "n_687191167",
    "name": "Ambodimanga",
    "source": "osm_neighbourhood",
    "lon": 47.53896928,
    "lat": -18.90110715
  },
  "n_5553415281": {
    "id": "n_5553415281",
    "name": "Ambodimanga",
    "source": "osm_neighbourhood",
    "lon": 47.5456078,
    "lat": -18.87999857
  },
  "n_668739133": {
    "id": "n_668739133",
    "name": "Ambodimita",
    "source": "osm_suburb",
    "lon": 47.48620048,
    "lat": -18.8667415
  },
  "n_837558570": {
    "id": "n_837558570",
    "name": "Ambodinisotry",
    "source": "osm_suburb",
    "lon": 47.51081654,
    "lat": -18.90722249
  },
  "n_12504457181": {
    "id": "n_12504457181",
    "name": "Ambodirano",
    "source": "osm_suburb",
    "lon": 47.50009053,
    "lat": -18.91500102
  },
  "n_681393250": {
    "id": "n_681393250",
    "name": "Ambodirotra",
    "source": "osm_neighbourhood",
    "lon": 47.53628237,
    "lat": -18.90940133
  },
  "n_681447076": {
    "id": "n_681447076",
    "name": "Amboditsiry",
    "source": "osm_suburb",
    "lon": 47.53514856,
    "lat": -18.88324397
  },
  "n_687168434": {
    "id": "n_687168434",
    "name": "Ambodivoanjo",
    "source": "osm_suburb",
    "lon": 47.53414041,
    "lat": -18.87539003
  },
  "n_13462289213": {
    "id": "n_13462289213",
    "name": "Ambodivoly Atsimo",
    "source": "osm_suburb",
    "lon": 47.45929305,
    "lat": -18.92497485
  },
  "n_13462289215": {
    "id": "n_13462289215",
    "name": "Ambodivoly Avaratra",
    "source": "osm_quarter",
    "lon": 47.45676932,
    "lat": -18.92593014
  },
  "rel_7763986": {
    "id": "rel_7763986",
    "name": "Ambodivona",
    "source": "osm_admin",
    "lon": 47.49341368,
    "lat": -18.94404442
  },
  "n_13462289208": {
    "id": "n_13462289208",
    "name": "Ambodivona",
    "source": "osm_quarter",
    "lon": 47.46051019,
    "lat": -18.92031952
  },
  "n_12504457179": {
    "id": "n_12504457179",
    "name": "Ambodivona",
    "source": "osm_suburb",
    "lon": 47.49915404,
    "lat": -18.8627062
  },
  "n_620818114": {
    "id": "n_620818114",
    "name": "Ambodivona",
    "source": "osm_suburb",
    "lon": 47.52818625,
    "lat": -18.89209544
  },
  "n_7149564265": {
    "id": "n_7149564265",
    "name": "Ambodivondava",
    "source": "osm_suburb",
    "lon": 47.5521341,
    "lat": -18.82890761
  },
  "n_668739147": {
    "id": "n_668739147",
    "name": "Ambodivonkely",
    "source": "osm_suburb",
    "lon": 47.50477224,
    "lat": -18.88077593
  },
  "n_668739130": {
    "id": "n_668739130",
    "name": "Ambohibao",
    "source": "osm_suburb",
    "lon": 47.47535404,
    "lat": -18.84315241
  },
  "n_837190453": {
    "id": "n_837190453",
    "name": "Ambohibarikely",
    "source": "osm_suburb",
    "lon": 47.51726259,
    "lat": -18.92812161
  },
  "n_7149685723": {
    "id": "n_7149685723",
    "name": "Ambohibary Namehana",
    "source": "osm_suburb",
    "lon": 47.52532344,
    "lat": -18.82535753
  },
  "n_2274967032": {
    "id": "n_2274967032",
    "name": "Ambohibe",
    "source": "osm_suburb",
    "lon": 47.57756434,
    "lat": -18.87942919
  },
  "n_5454040958": {
    "id": "n_5454040958",
    "name": "Ambohidahy",
    "source": "osm_suburb",
    "lon": 47.47953702,
    "lat": -18.91368973
  },
  "n_4287310111": {
    "id": "n_4287310111",
    "name": "Ambohidahy",
    "source": "osm_neighbourhood",
    "lon": 47.52529742,
    "lat": -18.91332006
  },
  "n_844907666": {
    "id": "n_844907666",
    "name": "Ambohidahy",
    "source": "osm_suburb",
    "lon": 47.55583526,
    "lat": -18.8950506
  },
  "n_12504457163": {
    "id": "n_12504457163",
    "name": "Ambohidavenona",
    "source": "osm_neighbourhood",
    "lon": 47.45772789,
    "lat": -18.89409694
  },
  "n_13462289217": {
    "id": "n_13462289217",
    "name": "Ambohidralamabo",
    "source": "osm_quarter",
    "lon": 47.45457137,
    "lat": -18.93126473
  },
  "n_5531126587": {
    "id": "n_5531126587",
    "name": "Ambohidrapeto",
    "source": "osm_suburb",
    "lon": 47.46960531,
    "lat": -18.89854279
  },
  "n_837197787": {
    "id": "n_837197787",
    "name": "Ambohidraserika",
    "source": "osm_neighbourhood",
    "lon": 47.54603551,
    "lat": -18.93424723
  },
  "n_5796259520": {
    "id": "n_5796259520",
    "name": "Ambohidrazaka",
    "source": "osm_neighbourhood",
    "lon": 47.57792568,
    "lat": -18.94797529
  },
  "n_668739135": {
    "id": "n_668739135",
    "name": "Ambohidroa",
    "source": "osm_suburb",
    "lon": 47.48624263,
    "lat": -18.85446287
  },
  "n_5454040964": {
    "id": "n_5454040964",
    "name": "Ambohijafy",
    "source": "osm_suburb",
    "lon": 47.48939708,
    "lat": -18.91107867
  },
  "n_12504457176": {
    "id": "n_12504457176",
    "name": "Ambohijanahary Antehiroka",
    "source": "osm_suburb",
    "lon": 47.50113712,
    "lat": -18.83207858
  },
  "n_12504457162": {
    "id": "n_12504457162",
    "name": "Ambohijanamasoandro",
    "source": "osm_neighbourhood",
    "lon": 47.47274532,
    "lat": -18.92244941
  },
  "n_13462289207": {
    "id": "n_13462289207",
    "name": "Ambohijatovo",
    "source": "osm_quarter",
    "lon": 47.46572696,
    "lat": -18.92597182
  },
  "n_686543335": {
    "id": "n_686543335",
    "name": "Ambohijatovo",
    "source": "osm_suburb",
    "lon": 47.52892142,
    "lat": -18.91184797
  },
  "n_696956149": {
    "id": "n_696956149",
    "name": "Ambohijatovo",
    "source": "osm_neighbourhood",
    "lon": 47.54156224,
    "lat": -18.87349974
  },
  "n_13462289225": {
    "id": "n_13462289225",
    "name": "Ambohikely",
    "source": "osm_neighbourhood",
    "lon": 47.47643695,
    "lat": -18.93327427
  },
  "n_681137737": {
    "id": "n_681137737",
    "name": "Ambohimahitsy",
    "source": "osm_suburb",
    "lon": 47.57171849,
    "lat": -18.89854326
  },
  "n_12851851333": {
    "id": "n_12851851333",
    "name": "Ambohimailala",
    "source": "osm_suburb",
    "lon": 47.5765224,
    "lat": -18.86630896
  },
  "n_687173778": {
    "id": "n_687173778",
    "name": "Ambohimamory",
    "source": "osm_suburb",
    "lon": 47.48487143,
    "lat": -18.93071812
  },
  "n_668739141": {
    "id": "n_668739141",
    "name": "Ambohimanandray",
    "source": "osm_suburb",
    "lon": 47.49568736,
    "lat": -18.87136737
  },
  "n_667624395": {
    "id": "n_667624395",
    "name": "Ambohimanarina",
    "source": "osm_suburb",
    "lon": 47.50147913,
    "lat": -18.87475555
  },
  "n_668739148": {
    "id": "n_668739148",
    "name": "Ambohimandroso",
    "source": "osm_suburb",
    "lon": 47.49683008,
    "lat": -18.88331669
  },
  "n_13462289218": {
    "id": "n_13462289218",
    "name": "Ambohimandroso Andrefana",
    "source": "osm_neighbourhood",
    "lon": 47.43489497,
    "lat": -18.92667588
  },
  "n_13462289219": {
    "id": "n_13462289219",
    "name": "Ambohimandroso Atsinanana",
    "source": "osm_suburb",
    "lon": 47.45124005,
    "lat": -18.92940094
  },
  "n_687173774": {
    "id": "n_687173774",
    "name": "Ambohimangidy",
    "source": "osm_suburb",
    "lon": 47.48016186,
    "lat": -18.96106639
  },
  "n_686542284": {
    "id": "n_686542284",
    "name": "Ambohimanoro",
    "source": "osm_neighbourhood",
    "lon": 47.5324639,
    "lat": -18.91676984
  },
  "n_13462289221": {
    "id": "n_13462289221",
    "name": "Ambohimarina",
    "source": "osm_neighbourhood",
    "lon": 47.46474418,
    "lat": -18.93453582
  },
  "n_931486391": {
    "id": "n_931486391",
    "name": "Ambohimiadana",
    "source": "osm_suburb",
    "lon": 47.44394621,
    "lat": -18.98986427
  },
  "n_681393174": {
    "id": "n_681393174",
    "name": "Ambohimiandra",
    "source": "osm_suburb",
    "lon": 47.54292533,
    "lat": -18.92926011
  },
  "n_687191172": {
    "id": "n_687191172",
    "name": "Ambohimirary",
    "source": "osm_suburb",
    "lon": 47.55181567,
    "lat": -18.89741242
  },
  "w_1311117945": {
    "id": "w_1311117945",
    "name": "Ambohimitsimbina",
    "source": "osm_suburb",
    "lon": 47.5308678,
    "lat": -18.92942979
  },
  "n_668739150": {
    "id": "n_668739150",
    "name": "Ambohimitsinjo",
    "source": "osm_suburb",
    "lon": 47.49448314,
    "lat": -18.87508658
  },
  "n_5316748708": {
    "id": "n_5316748708",
    "name": "Ambohinaorina",
    "source": "osm_suburb",
    "lon": 47.55042523,
    "lat": -18.83511514
  },
  "n_5271851710": {
    "id": "n_5271851710",
    "name": "Ambohipanja",
    "source": "osm_suburb",
    "lon": 47.54709582,
    "lat": -18.84068526
  },
  "n_5680854300": {
    "id": "n_5680854300",
    "name": "Ambohipo",
    "source": "osm_suburb",
    "lon": 47.55693545,
    "lat": -18.92701615
  },
  "n_5680854867": {
    "id": "n_5680854867",
    "name": "Ambohipo Tanàna",
    "source": "osm_neighbourhood",
    "lon": 47.56333474,
    "lat": -18.933119
  },
  "n_12504457189": {
    "id": "n_12504457189",
    "name": "Ambohipotsy",
    "source": "osm_neighbourhood",
    "lon": 47.53050248,
    "lat": -18.93113687
  },
  "n_11224960451": {
    "id": "n_11224960451",
    "name": "Ambohitrakely",
    "source": "osm_suburb",
    "lon": 47.5436344,
    "lat": -18.9041002
  },
  "n_687168440": {
    "id": "n_687168440",
    "name": "Ambohitrarahaba",
    "source": "osm_suburb",
    "lon": 47.54561284,
    "lat": -18.86134636
  },
  "n_7176802092": {
    "id": "n_7176802092",
    "name": "Ambohitrimanjaka",
    "source": "osm_suburb",
    "lon": 47.4408433,
    "lat": -18.86607439
  },
  "n_13462289206": {
    "id": "n_13462289206",
    "name": "Ambohitrinimanga",
    "source": "osm_quarter",
    "lon": 47.46348748,
    "lat": -18.92909815
  },
  "n_689610713": {
    "id": "n_689610713",
    "name": "Ambohitrinimanga",
    "source": "osm_neighbourhood",
    "lon": 47.54345584,
    "lat": -18.88582599
  },
  "n_686378273": {
    "id": "n_686378273",
    "name": "Ambohitsoa",
    "source": "osm_suburb",
    "lon": 47.54193672,
    "lat": -18.94098996
  },
  "n_681137785": {
    "id": "n_681137785",
    "name": "Ambolonkandrina",
    "source": "osm_suburb",
    "lon": 47.56152457,
    "lat": -18.92160899
  },
  "n_687168429": {
    "id": "n_687168429",
    "name": "Amboniloha",
    "source": "osm_neighbourhood",
    "lon": 47.52552156,
    "lat": -18.87009472
  },
  "n_5454040959": {
    "id": "n_5454040959",
    "name": "Ambonisoa",
    "source": "osm_neighbourhood",
    "lon": 47.48313976,
    "lat": -18.91263123
  },
  "n_13816663284": {
    "id": "n_13816663284",
    "name": "Ambovavady",
    "source": "osm_quarter",
    "lon": 47.45478299,
    "lat": -18.82248421
  },
  "n_9922907092": {
    "id": "n_9922907092",
    "name": "Amoronakona",
    "source": "osm_neighbourhood",
    "lon": 47.60253084,
    "lat": -18.93148687
  },
  "n_11923519763": {
    "id": "n_11923519763",
    "name": "Amorondria",
    "source": "osm_quarter",
    "lon": 47.5462027,
    "lat": -18.82809926
  },
  "n_681428134": {
    "id": "n_681428134",
    "name": "Ampahibe",
    "source": "osm_suburb",
    "lon": 47.53841209,
    "lat": -18.90887071
  },
  "n_837197786": {
    "id": "n_837197786",
    "name": "Ampamantanana Androndrabe",
    "source": "osm_suburb",
    "lon": 47.53627296,
    "lat": -18.94224228
  },
  "n_687191170": {
    "id": "n_687191170",
    "name": "Ampandrana",
    "source": "osm_suburb",
    "lon": 47.53399341,
    "lat": -18.90366457
  },
  "n_688357084": {
    "id": "n_688357084",
    "name": "Ampandrana Atsinanana",
    "source": "osm_suburb",
    "lon": 47.53692895,
    "lat": -18.90562191
  },
  "n_681428143": {
    "id": "n_681428143",
    "name": "Ampandrianomby",
    "source": "osm_neighbourhood",
    "lon": 47.54753748,
    "lat": -18.90307965
  },
  "n_931752003": {
    "id": "n_931752003",
    "name": "Ampanefy",
    "source": "osm_suburb",
    "lon": 47.47885003,
    "lat": -18.98364101
  },
  "n_12504002879": {
    "id": "n_12504002879",
    "name": "Ampangabe",
    "source": "osm_suburb",
    "lon": 47.4994735,
    "lat": -18.92660845
  },
  "n_5271851713": {
    "id": "n_5271851713",
    "name": "Ampangabe",
    "source": "osm_neighbourhood",
    "lon": 47.55209545,
    "lat": -18.84680409
  },
  "n_10559395465": {
    "id": "n_10559395465",
    "name": "Ampanotokana",
    "source": "osm_suburb",
    "lon": 47.55731218,
    "lat": -18.89971404
  },
  "n_617857577": {
    "id": "n_617857577",
    "name": "Amparibe",
    "source": "osm_suburb",
    "lon": 47.52596721,
    "lat": -18.91598969
  },
  "n_617341774": {
    "id": "n_617341774",
    "name": "Ampasamadinika",
    "source": "osm_neighbourhood",
    "lon": 47.51979679,
    "lat": -18.90919472
  },
  "n_681428140": {
    "id": "n_681428140",
    "name": "Ampasampito",
    "source": "osm_suburb",
    "lon": 47.54526642,
    "lat": -18.89580164
  },
  "n_11224960455": {
    "id": "n_11224960455",
    "name": "Ampasanimalo",
    "source": "osm_neighbourhood",
    "lon": 47.53998316,
    "lat": -18.91557441
  },
  "n_681393191": {
    "id": "n_681393191",
    "name": "Ampasanisadoda",
    "source": "osm_neighbourhood",
    "lon": 47.53487229,
    "lat": -18.91288903
  },
  "n_738247099": {
    "id": "n_738247099",
    "name": "Ampasika",
    "source": "osm_neighbourhood",
    "lon": 47.49715422,
    "lat": -18.90954135
  },
  "n_663240591": {
    "id": "n_663240591",
    "name": "Ampatsakana",
    "source": "osm_neighbourhood",
    "lon": 47.51892113,
    "lat": -18.91169867
  },
  "n_837558571": {
    "id": "n_837558571",
    "name": "Ampefiloha",
    "source": "osm_suburb",
    "lon": 47.51669827,
    "lat": -18.91433939
  },
  "n_687168435": {
    "id": "n_687168435",
    "name": "Ampetsapetsa",
    "source": "osm_neighbourhood",
    "lon": 47.53265227,
    "lat": -18.86362004
  },
  "n_687173783": {
    "id": "n_687173783",
    "name": "Ampitatafika",
    "source": "osm_suburb",
    "lon": 47.4787073,
    "lat": -18.93761306
  },
  "n_574547485": {
    "id": "n_574547485",
    "name": "Analakely",
    "source": "osm_suburb",
    "lon": 47.52688455,
    "lat": -18.90793337
  },
  "n_687168437": {
    "id": "n_687168437",
    "name": "Analamahitsy Cité",
    "source": "osm_suburb",
    "lon": 47.54786304,
    "lat": -18.87117972
  },
  "n_5537450303": {
    "id": "n_5537450303",
    "name": "Analamahitsy Tanàna",
    "source": "osm_suburb",
    "lon": 47.54940343,
    "lat": -18.87692465
  },
  "n_686376932": {
    "id": "n_686376932",
    "name": "Anatihazo",
    "source": "osm_suburb",
    "lon": 47.51072214,
    "lat": -18.9153845
  },
  "n_5271851714": {
    "id": "n_5271851714",
    "name": "Andafiavaratra",
    "source": "osm_suburb",
    "lon": 47.54897484,
    "lat": -18.85835428
  },
  "n_686366948": {
    "id": "n_686366948",
    "name": "Andavamamba",
    "source": "osm_suburb",
    "lon": 47.50904698,
    "lat": -18.9187492
  },
  "n_623449903": {
    "id": "n_623449903",
    "name": "Andohalo",
    "source": "osm_suburb",
    "lon": 47.53114451,
    "lat": -18.91795023
  },
  "n_12504457187": {
    "id": "n_12504457187",
    "name": "Andohamandry",
    "source": "osm_neighbourhood",
    "lon": 47.53369918,
    "lat": -18.93236929
  },
  "n_837540703": {
    "id": "n_837540703",
    "name": "Andohaniato",
    "source": "osm_neighbourhood",
    "lon": 47.56284339,
    "lat": -18.92539976
  },
  "n_5680854298": {
    "id": "n_5680854298",
    "name": "Andohanimandroseza",
    "source": "osm_suburb",
    "lon": 47.55228886,
    "lat": -18.92467452
  },
  "n_687180725": {
    "id": "n_687180725",
    "name": "Andoharanofotsy",
    "source": "osm_suburb",
    "lon": 47.53437856,
    "lat": -18.97854706
  },
  "n_5454111830": {
    "id": "n_5454111830",
    "name": "Andohatanjona Itaosy",
    "source": "osm_suburb",
    "lon": 47.43517256,
    "lat": -18.90353935
  },
  "n_686366965": {
    "id": "n_686366965",
    "name": "Andohatapenaka",
    "source": "osm_suburb",
    "lon": 47.49767641,
    "lat": -18.90128737
  },
  "n_5271851711": {
    "id": "n_5271851711",
    "name": "Andombotany",
    "source": "osm_neighbourhood",
    "lon": 47.55486258,
    "lat": -18.84373363
  },
  "n_703740357": {
    "id": "n_703740357",
    "name": "Andraharo",
    "source": "osm_suburb",
    "lon": 47.5081891,
    "lat": -18.88519559
  },
  "n_845962440": {
    "id": "n_845962440",
    "name": "Andrainarivo",
    "source": "osm_neighbourhood",
    "lon": 47.54446452,
    "lat": -18.90869727
  },
  "n_694182857": {
    "id": "n_694182857",
    "name": "Andraisoro",
    "source": "osm_suburb",
    "lon": 47.55698736,
    "lat": -18.90705029
  },
  "n_687180728": {
    "id": "n_687180728",
    "name": "Andralanitra",
    "source": "osm_neighbourhood",
    "lon": 47.57445936,
    "lat": -18.90863096
  },
  "n_5531126586": {
    "id": "n_5531126586",
    "name": "Andramahafoitra",
    "source": "osm_neighbourhood",
    "lon": 47.47319855,
    "lat": -18.89570274
  },
  "n_5531126588": {
    "id": "n_5531126588",
    "name": "Andramahavola",
    "source": "osm_suburb",
    "lon": 47.47289055,
    "lat": -18.90245039
  },
  "n_837197783": {
    "id": "n_837197783",
    "name": "Andrangaranga",
    "source": "osm_neighbourhood",
    "lon": 47.53786848,
    "lat": -18.93748274
  },
  "n_687164483": {
    "id": "n_687164483",
    "name": "Andranobevava",
    "source": "osm_neighbourhood",
    "lon": 47.541117,
    "lat": -18.88091887
  },
  "n_12504457183": {
    "id": "n_12504457183",
    "name": "Andranomanalina",
    "source": "osm_suburb",
    "lon": 47.51147487,
    "lat": -18.91036882
  },
  "n_668739137": {
    "id": "n_668739137",
    "name": "Andranomena",
    "source": "osm_suburb",
    "lon": 47.4804261,
    "lat": -18.85085569
  },
  "n_5271851712": {
    "id": "n_5271851712",
    "name": "Andranomena",
    "source": "osm_neighbourhood",
    "lon": 47.55892765,
    "lat": -18.84851056
  },
  "n_5454040957": {
    "id": "n_5454040957",
    "name": "Andranonahoatra",
    "source": "osm_suburb",
    "lon": 47.47469008,
    "lat": -18.91583352
  },
  "n_668739132": {
    "id": "n_668739132",
    "name": "Andranoro",
    "source": "osm_suburb",
    "lon": 47.47237674,
    "lat": -18.86405246
  },
  "n_681137746": {
    "id": "n_681137746",
    "name": "Andranovory",
    "source": "osm_neighbourhood",
    "lon": 47.57228611,
    "lat": -18.92498342
  },
  "n_5414315205": {
    "id": "n_5414315205",
    "name": "Andravako",
    "source": "osm_neighbourhood",
    "lon": 47.46341732,
    "lat": -18.89227919
  },
  "n_687191160": {
    "id": "n_687191160",
    "name": "Andravoahangy",
    "source": "osm_suburb",
    "lon": 47.53026807,
    "lat": -18.89868134
  },
  "n_686271702": {
    "id": "n_686271702",
    "name": "Andrefan'Ambohijanahary",
    "source": "osm_suburb",
    "lon": 47.52036462,
    "lat": -18.92293469
  },
  "n_5316748707": {
    "id": "n_5316748707",
    "name": "Andrefantsena",
    "source": "osm_suburb",
    "lon": 47.55447795,
    "lat": -18.83731019
  },
  "n_687168433": {
    "id": "n_687168433",
    "name": "Androhibe",
    "source": "osm_suburb",
    "lon": 47.54064713,
    "lat": -18.86484774
  },
  "n_686378280": {
    "id": "n_686378280",
    "name": "Androndrakely",
    "source": "osm_suburb",
    "lon": 47.53210165,
    "lat": -18.94717739
  },
  "n_697186988": {
    "id": "n_697186988",
    "name": "Andrononobe",
    "source": "osm_suburb",
    "lon": 47.55251101,
    "lat": -18.86791545
  },
  "n_837191410": {
    "id": "n_837191410",
    "name": "Angarangarana",
    "source": "osm_suburb",
    "lon": 47.5090765,
    "lat": -18.93503979
  },
  "n_13816663283": {
    "id": "n_13816663283",
    "name": "Angodongodona",
    "source": "osm_quarter",
    "lon": 47.4308415,
    "lat": -18.8229388
  },
  "n_687164484": {
    "id": "n_687164484",
    "name": "Anjanahary",
    "source": "osm_suburb",
    "lon": 47.53719075,
    "lat": -18.89530881
  },
  "n_931486397": {
    "id": "n_931486397",
    "name": "Anjanatsimiova",
    "source": "osm_neighbourhood",
    "lon": 47.47283268,
    "lat": -18.93938673
  },
  "rel_17812937": {
    "id": "rel_17812937",
    "name": "Anjeva Gara",
    "source": "osm_admin",
    "lon": 47.61904136,
    "lat": -18.92375112
  },
  "n_681393209": {
    "id": "n_681393209",
    "name": "Anjohy",
    "source": "osm_neighbourhood",
    "lon": 47.5337297,
    "lat": -18.9181703
  },
  "n_12504457169": {
    "id": "n_12504457169",
    "name": "Ankadiaivo",
    "source": "osm_neighbourhood",
    "lon": 47.54969203,
    "lat": -18.95067264
  },
  "n_681227159": {
    "id": "n_681227159",
    "name": "Ankadifotsy",
    "source": "osm_suburb",
    "lon": 47.52590848,
    "lat": -18.8966988
  },
  "n_5143429980": {
    "id": "n_5143429980",
    "name": "Ankadikely",
    "source": "osm_suburb",
    "lon": 47.55349063,
    "lat": -18.85106042
  },
  "n_12504457166": {
    "id": "n_12504457166",
    "name": "Ankadilalampotsy",
    "source": "osm_suburb",
    "lon": 47.53744766,
    "lat": -18.97204075
  },
  "n_694051796": {
    "id": "n_694051796",
    "name": "Ankadilalana",
    "source": "osm_suburb",
    "lon": 47.52872495,
    "lat": -18.9249218
  },
  "n_686271703": {
    "id": "n_686271703",
    "name": "Ankadimbahoaka",
    "source": "osm_suburb",
    "lon": 47.52327312,
    "lat": -18.94384175
  },
  "rel_17812936": {
    "id": "rel_17812936",
    "name": "Ankadinandriana",
    "source": "osm_admin",
    "lon": 47.61922376,
    "lat": -19.05428207
  },
  "n_5592523471": {
    "id": "n_5592523471",
    "name": "Ankadinandriana",
    "source": "osm_suburb",
    "lon": 47.54758827,
    "lat": -18.96909958
  },
  "n_687164486": {
    "id": "n_687164486",
    "name": "Ankadindramamy",
    "source": "osm_quarter",
    "lon": 47.55924746,
    "lat": -18.89147146
  },
  "n_681393181": {
    "id": "n_681393181",
    "name": "Ankadindratombo",
    "source": "osm_suburb",
    "lon": 47.55654096,
    "lat": -18.94138133
  },
  "n_12504457175": {
    "id": "n_12504457175",
    "name": "Ankadindravola Ivato",
    "source": "osm_suburb",
    "lon": 47.48580439,
    "lat": -18.82549791
  },
  "n_5416457563": {
    "id": "n_5416457563",
    "name": "Ankadirano",
    "source": "osm_neighbourhood",
    "lon": 47.50492875,
    "lat": -18.97854497
  },
  "n_931486387": {
    "id": "n_931486387",
    "name": "Ankaditany",
    "source": "osm_suburb",
    "lon": 47.47057408,
    "lat": -18.95049423
  },
  "n_12504457180": {
    "id": "n_12504457180",
    "name": "Ankaditapaka",
    "source": "osm_neighbourhood",
    "lon": 47.52353273,
    "lat": -18.89976699
  },
  "n_686159724": {
    "id": "n_686159724",
    "name": "Ankaditoho",
    "source": "osm_suburb",
    "lon": 47.52972904,
    "lat": -18.94054635
  },
  "n_681393255": {
    "id": "n_681393255",
    "name": "Ankadivato",
    "source": "osm_suburb",
    "lon": 47.53418515,
    "lat": -18.90885763
  },
  "n_931752004": {
    "id": "n_931752004",
    "name": "Ankadivoribe",
    "source": "osm_suburb",
    "lon": 47.46984266,
    "lat": -19.03066211
  },
  "n_837200474": {
    "id": "n_837200474",
    "name": "Ankadivory",
    "source": "osm_neighbourhood",
    "lon": 47.54789608,
    "lat": -18.92866733
  },
  "n_8862550402": {
    "id": "n_8862550402",
    "name": "Ankandrina",
    "source": "osm_neighbourhood",
    "lon": 47.56306752,
    "lat": -18.88531725
  },
  "n_686366969": {
    "id": "n_686366969",
    "name": "Ankasina",
    "source": "osm_neighbourhood",
    "lon": 47.50411408,
    "lat": -18.89624969
  },
  "n_13337796213": {
    "id": "n_13337796213",
    "name": "Ankatso",
    "source": "osm_suburb",
    "lon": 47.5513246,
    "lat": -18.9156378
  },
  "n_12504457170": {
    "id": "n_12504457170",
    "name": "Ankazobe",
    "source": "osm_neighbourhood",
    "lon": 47.58501086,
    "lat": -18.94135316
  },
  "n_845947786": {
    "id": "n_845947786",
    "name": "Ankazolava",
    "source": "osm_neighbourhood",
    "lon": 47.54147327,
    "lat": -18.94606639
  },
  "n_690711883": {
    "id": "n_690711883",
    "name": "Ankazomanga",
    "source": "osm_suburb",
    "lon": 47.51132285,
    "lat": -18.89170399
  },
  "rel_7797863": {
    "id": "rel_7797863",
    "name": "Ankazotoho",
    "source": "osm_admin",
    "lon": 47.49807139,
    "lat": -18.94497009
  },
  "n_681393197": {
    "id": "n_681393197",
    "name": "Ankazotokana",
    "source": "osm_suburb",
    "lon": 47.53613399,
    "lat": -18.91769281
  },
  "n_2724829809": {
    "id": "n_2724829809",
    "name": "Ankeniheny",
    "source": "osm_suburb",
    "lon": 47.52200575,
    "lat": -18.95309148
  },
  "n_5552401830": {
    "id": "n_5552401830",
    "name": "Ankerakely",
    "source": "osm_neighbourhood",
    "lon": 47.53584395,
    "lat": -18.92767016
  },
  "n_687164481": {
    "id": "n_687164481",
    "name": "Ankerana",
    "source": "osm_suburb",
    "lon": 47.55535331,
    "lat": -18.88639439
  },
  "n_688357090": {
    "id": "n_688357090",
    "name": "Ankorahotra",
    "source": "osm_suburb",
    "lon": 47.53719139,
    "lat": -18.91433992
  },
  "n_13462289220": {
    "id": "n_13462289220",
    "name": "Ankoroby",
    "source": "osm_neighbourhood",
    "lon": 47.46853338,
    "lat": -18.93250874
  },
  "n_844529035": {
    "id": "n_844529035",
    "name": "Ankorondrano",
    "source": "osm_suburb",
    "lon": 47.52297701,
    "lat": -18.88518871
  },
  "n_686376916": {
    "id": "n_686376916",
    "name": "Anosibe",
    "source": "osm_suburb",
    "lon": 47.51411695,
    "lat": -18.92340272
  },
  "n_5454040967": {
    "id": "n_5454040967",
    "name": "Anosimasina",
    "source": "osm_suburb",
    "lon": 47.49306327,
    "lat": -18.9138355
  },
  "n_9878925459": {
    "id": "n_9878925459",
    "name": "Anosipatrana",
    "source": "osm_suburb",
    "lon": 47.49439222,
    "lat": -18.92976447
  },
  "n_12504457178": {
    "id": "n_12504457178",
    "name": "Anosisoa",
    "source": "osm_suburb",
    "lon": 47.4918559,
    "lat": -18.87014843
  },
  "n_668739151": {
    "id": "n_668739151",
    "name": "Anosivavaka",
    "source": "osm_suburb",
    "lon": 47.50932389,
    "lat": -18.87338286
  },
  "w_359369846": {
    "id": "w_359369846",
    "name": "Anosivavaka",
    "source": "osm_neighbourhood",
    "lon": 47.50956003,
    "lat": -18.87666536
  },
  "n_686376924": {
    "id": "n_686376924",
    "name": "Anosizato Andrefana",
    "source": "osm_suburb",
    "lon": 47.49581144,
    "lat": -18.9392337
  },
  "n_728268650": {
    "id": "n_728268650",
    "name": "Anosizato Atsinanana",
    "source": "osm_suburb",
    "lon": 47.50243126,
    "lat": -18.93833337
  },
  "n_837558566": {
    "id": "n_837558566",
    "name": "Anosy",
    "source": "osm_suburb",
    "lon": 47.51907887,
    "lat": -18.91763976
  },
  "n_5281966844": {
    "id": "n_5281966844",
    "name": "Antalata",
    "source": "osm_suburb",
    "lon": 47.50258777,
    "lat": -18.98386187
  },
  "rel_7763796": {
    "id": "rel_7763796",
    "name": "Antananambony",
    "source": "osm_admin",
    "lon": 47.49741666,
    "lat": -18.9394194
  },
  "n_5271851715": {
    "id": "n_5271851715",
    "name": "Antanandrano",
    "source": "osm_suburb",
    "lon": 47.53503502,
    "lat": -18.85195111
  },
  "rel_7763924": {
    "id": "rel_7763924",
    "name": "Antandrokomby",
    "source": "osm_admin",
    "lon": 47.49029463,
    "lat": -18.94132598
  },
  "n_5454040950": {
    "id": "n_5454040950",
    "name": "Antandrokomby",
    "source": "osm_neighbourhood",
    "lon": 47.49079314,
    "lat": -18.9056751
  },
  "n_668739139": {
    "id": "n_668739139",
    "name": "Antanety",
    "source": "osm_suburb",
    "lon": 47.49912499,
    "lat": -18.87249244
  },
  "n_5271851716": {
    "id": "n_5271851716",
    "name": "Antanety Atsimo",
    "source": "osm_neighbourhood",
    "lon": 47.54736832,
    "lat": -18.8515261
  },
  "n_5271851717": {
    "id": "n_5271851717",
    "name": "Antanety Avaratra",
    "source": "osm_neighbourhood",
    "lon": 47.54502433,
    "lat": -18.84621189
  },
  "n_843310804": {
    "id": "n_843310804",
    "name": "Antanimena",
    "source": "osm_suburb",
    "lon": 47.52021667,
    "lat": -18.89678933
  },
  "n_574646963": {
    "id": "n_574646963",
    "name": "Antaninarenina",
    "source": "osm_suburb",
    "lon": 47.52538879,
    "lat": -18.91031564
  },
  "n_668739152": {
    "id": "n_668739152",
    "name": "Antanjombe",
    "source": "osm_suburb",
    "lon": 47.50609101,
    "lat": -18.86798459
  },
  "n_13462289214": {
    "id": "n_13462289214",
    "name": "Antanjona",
    "source": "osm_quarter",
    "lon": 47.45425837,
    "lat": -18.91933393
  },
  "n_690711890": {
    "id": "n_690711890",
    "name": "Antohomadinika",
    "source": "osm_suburb",
    "lon": 47.51599984,
    "lat": -18.90395748
  },
  "n_11224960454": {
    "id": "n_11224960454",
    "name": "Antsahabe",
    "source": "osm_neighbourhood",
    "lon": 47.53337603,
    "lat": -18.91467879
  },
  "n_5531126585": {
    "id": "n_5531126585",
    "name": "Antsahakely",
    "source": "osm_neighbourhood",
    "lon": 47.48092599,
    "lat": -18.88784804
  },
  "n_5271851704": {
    "id": "n_5271851704",
    "name": "Antsahamaina",
    "source": "osm_neighbourhood",
    "lon": 47.55393452,
    "lat": -18.86041915
  },
  "n_686539609": {
    "id": "n_686539609",
    "name": "Antsahamamy",
    "source": "osm_neighbourhood",
    "lon": 47.55767521,
    "lat": -18.9165528
  },
  "n_7149685720": {
    "id": "n_7149685720",
    "name": "Antsahamarofoza",
    "source": "osm_suburb",
    "lon": 47.6046509,
    "lat": -18.83799472
  },
  "n_5680854299": {
    "id": "n_5680854299",
    "name": "Antsahameva",
    "source": "osm_neighbourhood",
    "lon": 47.55016,
    "lat": -18.90963462
  },
  "n_10567187961": {
    "id": "n_10567187961",
    "name": "Antsahasoa",
    "source": "osm_suburb",
    "lon": 47.53463129,
    "lat": -18.96503057
  },
  "n_7149685730": {
    "id": "n_7149685730",
    "name": "Antsahatsiresy",
    "source": "osm_suburb",
    "lon": 47.56362755,
    "lat": -18.82636299
  },
  "n_9758897058": {
    "id": "n_9758897058",
    "name": "Antsahavola",
    "source": "osm_neighbourhood",
    "lon": 47.52230347,
    "lat": -18.9090229
  },
  "n_668739136": {
    "id": "n_668739136",
    "name": "Antsahavolakely",
    "source": "osm_neighbourhood",
    "lon": 47.49694455,
    "lat": -18.85191753
  },
  "n_688357091": {
    "id": "n_688357091",
    "name": "Antsakaviro",
    "source": "osm_suburb",
    "lon": 47.53663187,
    "lat": -18.91150027
  },
  "n_837558569": {
    "id": "n_837558569",
    "name": "Antsalovana",
    "source": "osm_neighbourhood",
    "lon": 47.51334708,
    "lat": -18.89816422
  },
  "n_12504457172": {
    "id": "n_12504457172",
    "name": "Antsampandrano",
    "source": "osm_suburb",
    "lon": 47.58137492,
    "lat": -18.84828288
  },
  "n_681137748": {
    "id": "n_681137748",
    "name": "Antsobolo",
    "source": "osm_neighbourhood",
    "lon": 47.56879992,
    "lat": -18.91267332
  },
  "n_5538613938": {
    "id": "n_5538613938",
    "name": "Antsofinondry",
    "source": "osm_suburb",
    "lon": 47.55740936,
    "lat": -18.82793149
  },
  "n_12066924735": {
    "id": "n_12066924735",
    "name": "Atendro",
    "source": "osm_suburb",
    "lon": 47.55103452,
    "lat": -18.82284252
  },
  "n_931486395": {
    "id": "n_931486395",
    "name": "Atsimombohitra",
    "source": "osm_suburb",
    "lon": 47.4779925,
    "lat": -18.94271495
  },
  "n_5316748706": {
    "id": "n_5316748706",
    "name": "Atsinanantsena",
    "source": "osm_suburb",
    "lon": 47.55764219,
    "lat": -18.83687293
  },
  "n_5454040948": {
    "id": "n_5454040948",
    "name": "Atsinanantsena Ambohidrapeto",
    "source": "osm_suburb",
    "lon": 47.47801434,
    "lat": -18.90451619
  },
  "n_687173779": {
    "id": "n_687173779",
    "name": "Avarabohitra",
    "source": "osm_suburb",
    "lon": 47.47912994,
    "lat": -18.92508804
  },
  "n_681428137": {
    "id": "n_681428137",
    "name": "Avaradoha",
    "source": "osm_suburb",
    "lon": 47.54400446,
    "lat": -18.90017377
  },
  "n_668739129": {
    "id": "n_668739129",
    "name": "Avaratanàna",
    "source": "osm_suburb",
    "lon": 47.48537735,
    "lat": -18.83953232
  },
  "n_10568170733": {
    "id": "n_10568170733",
    "name": "Avaratetezana",
    "source": "osm_suburb",
    "lon": 47.48652291,
    "lat": -18.86055698
  },
  "n_728268649": {
    "id": "n_728268649",
    "name": "Avaratetezana",
    "source": "osm_suburb",
    "lon": 47.4822914,
    "lat": -18.93560127
  },
  "n_681428157": {
    "id": "n_681428157",
    "name": "Avaratr'Antanimora",
    "source": "osm_suburb",
    "lon": 47.54296344,
    "lat": -18.91367917
  },
  "n_5454040952": {
    "id": "n_5454040952",
    "name": "Avaratsena Ambohidrapeto",
    "source": "osm_suburb",
    "lon": 47.47296884,
    "lat": -18.9079402
  },
  "n_5454040956": {
    "id": "n_5454040956",
    "name": "Behenjy",
    "source": "osm_neighbourhood",
    "lon": 47.47026332,
    "lat": -18.9113583
  },
  "n_837567373": {
    "id": "n_837567373",
    "name": "Behoririka",
    "source": "osm_suburb",
    "lon": 47.52629659,
    "lat": -18.90204907
  },
  "n_686366959": {
    "id": "n_686366959",
    "name": "Bekiraro",
    "source": "osm_neighbourhood",
    "lon": 47.51431315,
    "lat": -18.9078555
  },
  "n_11224960453": {
    "id": "n_11224960453",
    "name": "Bel'air",
    "source": "osm_neighbourhood",
    "lon": 47.53271964,
    "lat": -18.90643224
  },
  "n_4206843240": {
    "id": "n_4206843240",
    "name": "Belanitra",
    "source": "osm_suburb",
    "lon": 47.52223664,
    "lat": -18.83985525
  },
  "n_5454040966": {
    "id": "n_5454040966",
    "name": "Bemasoandro",
    "source": "osm_suburb",
    "lon": 47.48670853,
    "lat": -18.91396644
  },
  "n_688379376": {
    "id": "n_688379376",
    "name": "Besarety",
    "source": "osm_suburb",
    "lon": 47.53615166,
    "lat": -18.90155065
  },
  "n_668739140": {
    "id": "n_668739140",
    "name": "Betafo",
    "source": "osm_suburb",
    "lon": 47.5022086,
    "lat": -18.87836075
  },
  "n_681428130": {
    "id": "n_681428130",
    "name": "Betongolo",
    "source": "osm_suburb",
    "lon": 47.54021701,
    "lat": -18.90520997
  },
  "n_687180724": {
    "id": "n_687180724",
    "name": "Bevalala",
    "source": "osm_neighbourhood",
    "lon": 47.51630032,
    "lat": -18.97813772
  },
  "n_5680854873": {
    "id": "n_5680854873",
    "name": "Bibilava",
    "source": "osm_neighbourhood",
    "lon": 47.56454737,
    "lat": -18.91666885
  },
  "w_148444594": {
    "id": "w_148444594",
    "name": "Building cité Perrier",
    "source": "osm_neighbourhood",
    "lon": 47.53054391,
    "lat": -18.90326552
  },
  "n_5454040953": {
    "id": "n_5454040953",
    "name": "Cité Itaosy Akany Sambatra",
    "source": "osm_suburb",
    "lon": 47.47855265,
    "lat": -18.90957116
  },
  "n_9735006975": {
    "id": "n_9735006975",
    "name": "Cité militaire",
    "source": "osm_locality",
    "lon": 47.55276182,
    "lat": -18.89058441
  },
  "n_688359813": {
    "id": "n_688359813",
    "name": "Cité Planton",
    "source": "osm_neighbourhood",
    "lon": 47.54078478,
    "lat": -18.90910746
  },
  "n_687173785": {
    "id": "n_687173785",
    "name": "Faliarivo",
    "source": "osm_suburb",
    "lon": 47.46037908,
    "lat": -18.94790424
  },
  "n_13462289226": {
    "id": "n_13462289226",
    "name": "Faliarivo II",
    "source": "osm_suburb",
    "lon": 47.47306034,
    "lat": -18.93179439
  },
  "n_12062920445": {
    "id": "n_12062920445",
    "name": "Famatanantsoa",
    "source": "osm_locality",
    "lon": 47.53125919,
    "lat": -18.87129809
  },
  "n_686545015": {
    "id": "n_686545015",
    "name": "Faravohitra",
    "source": "osm_suburb",
    "lon": 47.52972315,
    "lat": -18.90851791
  },
  "n_12504002878": {
    "id": "n_12504002878",
    "name": "Fasan'ny Karàna",
    "source": "osm_neighbourhood",
    "lon": 47.51381108,
    "lat": -18.94889738
  },
  "n_837197788": {
    "id": "n_837197788",
    "name": "Fenomanana",
    "source": "osm_neighbourhood",
    "lon": 47.54231536,
    "lat": -18.93313971
  },
  "rel_17812946": {
    "id": "rel_17812946",
    "name": "Fiadanana",
    "source": "osm_admin",
    "lon": 47.426542,
    "lat": -18.89690327
  },
  "n_837191897": {
    "id": "n_837191897",
    "name": "Fiadanana",
    "source": "osm_suburb",
    "lon": 47.52444488,
    "lat": -18.93346357
  },
  "n_5531126582": {
    "id": "n_5531126582",
    "name": "Fiombonana",
    "source": "osm_neighbourhood",
    "lon": 47.47660061,
    "lat": -18.8955481
  },
  "n_6313190685": {
    "id": "n_6313190685",
    "name": "Fokontany Manankasina",
    "source": "osm_quarter",
    "lon": 47.48663217,
    "lat": -19.08217245
  },
  "n_5680854869": {
    "id": "n_5680854869",
    "name": "Fort Duchesne",
    "source": "osm_neighbourhood",
    "lon": 47.54696799,
    "lat": -18.91289368
  },
  "n_6673050118": {
    "id": "n_6673050118",
    "name": "Golan",
    "source": "osm_neighbourhood",
    "lon": 47.4909982,
    "lat": -18.87319168
  },
  "n_12504457188": {
    "id": "n_12504457188",
    "name": "Haute Ville",
    "source": "osm_suburb",
    "lon": 47.53101604,
    "lat": -18.92693771
  },
  "n_687164487": {
    "id": "n_687164487",
    "name": "Iadiambola",
    "source": "osm_neighbourhood",
    "lon": 47.54918623,
    "lat": -18.89354143
  },
  "rel_17812949": {
    "id": "rel_17812949",
    "name": "Iarinarivo",
    "source": "osm_admin",
    "lon": 47.42554808,
    "lat": -18.84544635
  },
  "n_687180731": {
    "id": "n_687180731",
    "name": "Iavoloha",
    "source": "osm_suburb",
    "lon": 47.53852348,
    "lat": -19.01774482
  },
  "n_12504457167": {
    "id": "n_12504457167",
    "name": "Ifarihy",
    "source": "osm_suburb",
    "lon": 47.54769901,
    "lat": -18.9610491
  },
  "n_12504457174": {
    "id": "n_12504457174",
    "name": "Ikianja",
    "source": "osm_suburb",
    "lon": 47.59511234,
    "lat": -18.90805904
  },
  "n_12504457173": {
    "id": "n_12504457173",
    "name": "Ilafy",
    "source": "osm_suburb",
    "lon": 47.56585884,
    "lat": -18.85444388
  },
  "n_686376928": {
    "id": "n_686376928",
    "name": "Ilanivato",
    "source": "osm_suburb",
    "lon": 47.49979963,
    "lat": -18.92203463
  },
  "n_12506457104": {
    "id": "n_12506457104",
    "name": "Imerimanjaka",
    "source": "osm_suburb",
    "lon": 47.55017358,
    "lat": -18.97864176
  },
  "n_672735040": {
    "id": "n_672735040",
    "name": "Imerinafovoany",
    "source": "osm_suburb",
    "lon": 47.46807633,
    "lat": -18.84004877
  },
  "n_931752002": {
    "id": "n_931752002",
    "name": "Isaingy",
    "source": "osm_suburb",
    "lon": 47.49641038,
    "lat": -18.96929286
  },
  "n_620027471": {
    "id": "n_620027471",
    "name": "Isoraka",
    "source": "osm_suburb",
    "lon": 47.52119441,
    "lat": -18.91306207
  },
  "n_574265718": {
    "id": "n_574265718",
    "name": "Isotry",
    "source": "osm_suburb",
    "lon": 47.51641297,
    "lat": -18.90973958
  },
  "n_687175200": {
    "id": "n_687175200",
    "name": "Itaosy",
    "source": "osm_suburb",
    "lon": 47.47058585,
    "lat": -18.91784076
  },
  "n_687168428": {
    "id": "n_687168428",
    "name": "Ivandry",
    "source": "osm_suburb",
    "lon": 47.52331803,
    "lat": -18.8775244
  },
  "n_12504457184": {
    "id": "n_12504457184",
    "name": "Ivolaniray",
    "source": "osm_neighbourhood",
    "lon": 47.50611264,
    "lat": -18.92745451
  },
  "n_686271708": {
    "id": "n_686271708",
    "name": "Madera Namontana",
    "source": "osm_suburb",
    "lon": 47.51806961,
    "lat": -18.93728804
  },
  "n_12506457106": {
    "id": "n_12506457106",
    "name": "Mahabo",
    "source": "osm_suburb",
    "lon": 47.53620993,
    "lat": -18.98674349
  },
  "n_12504457164": {
    "id": "n_12504457164",
    "name": "Mahalavolona",
    "source": "osm_suburb",
    "lon": 47.5242771,
    "lat": -18.98994557
  },
  "n_574551024": {
    "id": "n_574551024",
    "name": "Mahamasina",
    "source": "osm_suburb",
    "lon": 47.52435377,
    "lat": -18.91861966
  },
  "n_12504002876": {
    "id": "n_12504002876",
    "name": "Mahamasina Atsimo",
    "source": "osm_neighbourhood",
    "lon": 47.52514576,
    "lat": -18.92312314
  },
  "n_687168427": {
    "id": "n_687168427",
    "name": "Mahatony",
    "source": "osm_neighbourhood",
    "lon": 47.52564666,
    "lat": -18.86165688
  },
  "n_3682650472": {
    "id": "n_3682650472",
    "name": "Mahatsara",
    "source": "osm_neighbourhood",
    "lon": 47.60344315,
    "lat": -18.88135955
  },
  "n_687191168": {
    "id": "n_687191168",
    "name": "Mahavoky",
    "source": "osm_neighbourhood",
    "lon": 47.53430338,
    "lat": -18.89935567
  },
  "n_687164485": {
    "id": "n_687164485",
    "name": "Mahazo",
    "source": "osm_neighbourhood",
    "lon": 47.5621991,
    "lat": -18.89539419
  },
  "n_686378306": {
    "id": "n_686378306",
    "name": "Mahazoarivo",
    "source": "osm_suburb",
    "lon": 47.54693567,
    "lat": -18.94000206
  },
  "n_7184912074": {
    "id": "n_7184912074",
    "name": "Maibahoaka",
    "source": "osm_suburb",
    "lon": 47.4607621,
    "lat": -18.82938102
  },
  "n_12504457165": {
    "id": "n_12504457165",
    "name": "Malaho",
    "source": "osm_suburb",
    "lon": 47.50930502,
    "lat": -18.97195743
  },
  "n_687173775": {
    "id": "n_687173775",
    "name": "Malaza",
    "source": "osm_suburb",
    "lon": 47.43429954,
    "lat": -18.95525879
  },
  "n_687180730": {
    "id": "n_687180730",
    "name": "Malaza",
    "source": "osm_neighbourhood",
    "lon": 47.52910699,
    "lat": -18.9718258
  },
  "n_845962439": {
    "id": "n_845962439",
    "name": "Manakambahiny",
    "source": "osm_suburb",
    "lon": 47.53752661,
    "lat": -18.93112851
  },
  "n_13462289223": {
    "id": "n_13462289223",
    "name": "Manampisoa",
    "source": "osm_suburb",
    "lon": 47.46169964,
    "lat": -18.93290578
  },
  "n_9526189873": {
    "id": "n_9526189873",
    "name": "Manandona",
    "source": "osm_neighbourhood",
    "lon": 47.55074708,
    "lat": -18.99237257
  },
  "n_837191898": {
    "id": "n_837191898",
    "name": "Mananjara",
    "source": "osm_suburb",
    "lon": 47.52310924,
    "lat": -18.92884128
  },
  "n_12504457182": {
    "id": "n_12504457182",
    "name": "Manarintsoa",
    "source": "osm_suburb",
    "lon": 47.51357984,
    "lat": -18.91324155
  },
  "n_7149685724": {
    "id": "n_7149685724",
    "name": "Manarintsoa Namehana",
    "source": "osm_suburb",
    "lon": 47.53877553,
    "lat": -18.82694851
  },
  "n_837190450": {
    "id": "n_837190450",
    "name": "Mandrangobato",
    "source": "osm_suburb",
    "lon": 47.51152635,
    "lat": -18.92896422
  },
  "n_637715766": {
    "id": "n_637715766",
    "name": "Mandriambero",
    "source": "osm_suburb",
    "lon": 47.43478476,
    "lat": -18.83411318
  },
  "n_686378314": {
    "id": "n_686378314",
    "name": "Mandroseza",
    "source": "osm_suburb",
    "lon": 47.5514328,
    "lat": -18.93379966
  },
  "n_687191164": {
    "id": "n_687191164",
    "name": "Mandrosoa",
    "source": "osm_neighbourhood",
    "lon": 47.5290647,
    "lat": -18.91047062
  },
  "n_923872934": {
    "id": "n_923872934",
    "name": "Mandrosoa",
    "source": "osm_suburb",
    "lon": 47.56093453,
    "lat": -18.87143177
  },
  "n_7798554173": {
    "id": "n_7798554173",
    "name": "Mandrosoa Ivato",
    "source": "osm_suburb",
    "lon": 47.47157285,
    "lat": -18.82553218
  },
  "n_13462289209": {
    "id": "n_13462289209",
    "name": "Mangarivotra",
    "source": "osm_quarter",
    "lon": 47.46396568,
    "lat": -18.9230128
  },
  "n_686545016": {
    "id": "n_686545016",
    "name": "Mangarivotra",
    "source": "osm_neighbourhood",
    "lon": 47.53207019,
    "lat": -18.91037506
  },
  "n_687168432": {
    "id": "n_687168432",
    "name": "Manjaka Ilafy",
    "source": "osm_suburb",
    "lon": 47.55918731,
    "lat": -18.86001886
  },
  "n_687168439": {
    "id": "n_687168439",
    "name": "Manjakaray",
    "source": "osm_suburb",
    "lon": 47.53251732,
    "lat": -18.88904562
  },
  "n_5531126580": {
    "id": "n_5531126580",
    "name": "Marobiby",
    "source": "osm_suburb",
    "lon": 47.48033783,
    "lat": -18.8956876
  },
  "n_686159725": {
    "id": "n_686159725",
    "name": "Marohoho",
    "source": "osm_neighbourhood",
    "lon": 47.53372052,
    "lat": -18.93654356
  },
  "n_687191161": {
    "id": "n_687191161",
    "name": "Mascar",
    "source": "osm_suburb",
    "lon": 47.53286728,
    "lat": -18.89584617
  },
  "n_7149685718": {
    "id": "n_7149685718",
    "name": "Masinandriana",
    "source": "osm_suburb",
    "lon": 47.5671703,
    "lat": -18.87837279
  },
  "n_12504002877": {
    "id": "n_12504002877",
    "name": "Miadana",
    "source": "osm_neighbourhood",
    "lon": 47.5097106,
    "lat": -18.94230708
  },
  "n_12504457168": {
    "id": "n_12504457168",
    "name": "Miadana",
    "source": "osm_neighbourhood",
    "lon": 47.59194309,
    "lat": -18.96455142
  },
  "n_9758912238": {
    "id": "n_9758912238",
    "name": "Miandrarivo",
    "source": "osm_neighbourhood",
    "lon": 47.5372013,
    "lat": -18.92472498
  },
  "n_13462289222": {
    "id": "n_13462289222",
    "name": "Morarano",
    "source": "osm_neighbourhood",
    "lon": 47.45780961,
    "lat": -18.93581376
  },
  "n_837197782": {
    "id": "n_837197782",
    "name": "Morarano",
    "source": "osm_suburb",
    "lon": 47.54026476,
    "lat": -18.93523058
  },
  "n_668739131": {
    "id": "n_668739131",
    "name": "Morondava",
    "source": "osm_suburb",
    "lon": 47.46544831,
    "lat": -18.85314235
  },
  "n_7149685729": {
    "id": "n_7149685729",
    "name": "Namehana",
    "source": "osm_suburb",
    "lon": 47.54237553,
    "lat": -18.83182217
  },
  "n_681434750": {
    "id": "n_681434750",
    "name": "Nanisana",
    "source": "osm_suburb",
    "lon": 47.54839562,
    "lat": -18.88810006
  },
  "n_12504457185": {
    "id": "n_12504457185",
    "name": "Ouest Mananjara",
    "source": "osm_suburb",
    "lon": 47.51699648,
    "lat": -18.93240926
  },
  "n_4371790027": {
    "id": "n_4371790027",
    "name": "Presidential Place",
    "source": "osm_locality",
    "lon": 47.52376151,
    "lat": -18.91236414
  },
  "n_5531126579": {
    "id": "n_5531126579",
    "name": "Sakanambazo",
    "source": "osm_neighbourhood",
    "lon": 47.48489003,
    "lat": -18.8997717
  },
  "n_12061261553": {
    "id": "n_12061261553",
    "name": "Saropody",
    "source": "osm_neighbourhood",
    "lon": 47.53745086,
    "lat": -18.95359941
  },
  "n_5271851709": {
    "id": "n_5271851709",
    "name": "Seranina",
    "source": "osm_neighbourhood",
    "lon": 47.53922175,
    "lat": -18.83993068
  },
  "n_687164488": {
    "id": "n_687164488",
    "name": "Soamanandrariny",
    "source": "osm_suburb",
    "lon": 47.5670229,
    "lat": -18.89024504
  },
  "n_7149685731": {
    "id": "n_7149685731",
    "name": "Soaniadanana",
    "source": "osm_suburb",
    "lon": 47.5620144,
    "lat": -18.84159805
  },
  "n_686271697": {
    "id": "n_686271697",
    "name": "Soanierana",
    "source": "osm_suburb",
    "lon": 47.52391421,
    "lat": -18.93838268
  },
  "n_837567376": {
    "id": "n_837567376",
    "name": "Soarano",
    "source": "osm_suburb",
    "lon": 47.52118296,
    "lat": -18.90325226
  },
  "n_687168430": {
    "id": "n_687168430",
    "name": "Soavimasoandro",
    "source": "osm_suburb",
    "lon": 47.51451404,
    "lat": -18.85551482
  },
  "n_681434761": {
    "id": "n_681434761",
    "name": "Soavimbahoaka",
    "source": "osm_neighbourhood",
    "lon": 47.54189322,
    "lat": -18.89138189
  },
  "n_931752010": {
    "id": "n_931752010",
    "name": "Soavina",
    "source": "osm_suburb",
    "lon": 47.50252857,
    "lat": -18.95837576
  },
  "n_12504457192": {
    "id": "n_12504457192",
    "name": "Soavinandriana",
    "source": "osm_neighbourhood",
    "lon": 47.5409755,
    "lat": -18.89743545
  },
  "n_672735082": {
    "id": "n_672735082",
    "name": "Talatamaty",
    "source": "osm_suburb",
    "lon": 47.45050513,
    "lat": -18.84341657
  },
  "n_687173781": {
    "id": "n_687173781",
    "name": "Tangaina",
    "source": "osm_neighbourhood",
    "lon": 47.4860392,
    "lat": -18.94507051
  },
  "n_687180729": {
    "id": "n_687180729",
    "name": "Tanjombato",
    "source": "osm_suburb",
    "lon": 47.52701684,
    "lat": -18.95874513
  },
  "n_694218753": {
    "id": "n_694218753",
    "name": "Tongarivo",
    "source": "osm_suburb",
    "lon": 47.52371587,
    "lat": -18.96621786
  },
  "n_5316748705": {
    "id": "n_5316748705",
    "name": "Tsarafara",
    "source": "osm_suburb",
    "lon": 47.5649075,
    "lat": -18.83591265
  },
  "n_681393166": {
    "id": "n_681393166",
    "name": "Tsarafaritra Tsimbazaza",
    "source": "osm_suburb",
    "lon": 47.5289058,
    "lat": -18.93468323
  },
  "n_5680854207": {
    "id": "n_5680854207",
    "name": "Tsarahonenana",
    "source": "osm_suburb",
    "lon": 47.5512819,
    "lat": -18.90365164
  },
  "n_574539686": {
    "id": "n_574539686",
    "name": "Tsaralalàna",
    "source": "osm_suburb",
    "lon": 47.5198171,
    "lat": -18.9063838
  },
  "n_844529031": {
    "id": "n_844529031",
    "name": "Tsaramasay",
    "source": "osm_neighbourhood",
    "lon": 47.51734801,
    "lat": -18.89045031
  },
  "n_13462289210": {
    "id": "n_13462289210",
    "name": "Tsararay Lailava",
    "source": "osm_suburb",
    "lon": 47.46093732,
    "lat": -18.92480413
  },
  "n_11987385329": {
    "id": "n_11987385329",
    "name": "Tsararivotra",
    "source": "osm_neighbourhood",
    "lon": 47.57312617,
    "lat": -19.06310491
  },
  "n_687168431": {
    "id": "n_687168431",
    "name": "Tsarasaotra",
    "source": "osm_neighbourhood",
    "lon": 47.51487695,
    "lat": -18.86768807
  },
  "n_681400105": {
    "id": "n_681400105",
    "name": "Tsiadana",
    "source": "osm_suburb",
    "lon": 47.54534094,
    "lat": -18.91843925
  },
  "n_12506457103": {
    "id": "n_12506457103",
    "name": "Tsilazaina",
    "source": "osm_neighbourhood",
    "lon": 47.59114034,
    "lat": -19.00102737
  },
  "n_12504002874": {
    "id": "n_12504002874",
    "name": "Tsimialonjafy",
    "source": "osm_neighbourhood",
    "lon": 47.52915443,
    "lat": -18.91927169
  },
  "n_6782874587": {
    "id": "n_6782874587",
    "name": "Village Akamasoa",
    "source": "osm_neighbourhood",
    "lon": 47.5787167,
    "lat": -18.89240186
  },
  "n_13462289227": {
    "id": "n_13462289227",
    "name": "Vinany",
    "source": "osm_suburb",
    "lon": 47.47159123,
    "lat": -18.92691525
  },
  "n_681393224": {
    "id": "n_681393224",
    "name": "Volosarika",
    "source": "osm_neighbourhood",
    "lon": 47.53920996,
    "lat": -18.92157817
  },
  "n_12509205379": {
    "id": "n_12509205379",
    "name": "Volotara",
    "source": "osm_suburb",
    "lon": 47.52456434,
    "lat": -18.97808425
  },
  "n_5531126581": {
    "id": "n_5531126581",
    "name": "Vonelina",
    "source": "osm_neighbourhood",
    "lon": 47.47266386,
    "lat": -18.88500079
  }
}

export const quartiersByLowerName: Readonly<Record<string, Quartier>> = {
  "67 ha": {
    "id": "n_837558568",
    "name": "67 ha",
    "source": "osm_suburb",
    "lon": 47.5084707,
    "lat": -18.90518273
  },
  "67 ha atsimo": {
    "id": "n_725856151",
    "name": "67 ha Atsimo",
    "source": "osm_neighbourhood",
    "lon": 47.50602225,
    "lat": -18.90985853
  },
  "67 ha avaratra andrefana": {
    "id": "n_837558567",
    "name": "67 ha Avaratra Andrefana",
    "source": "osm_neighbourhood",
    "lon": 47.50591572,
    "lat": -18.90301144
  },
  "67 ha avaratra atsinanana": {
    "id": "n_12504457186",
    "name": "67 ha Avaratra Atsinanana",
    "source": "osm_neighbourhood",
    "lon": 47.51193316,
    "lat": -18.90255286
  },
  "akany marisa": {
    "id": "n_12062907602",
    "name": "Akany Marisa",
    "source": "osm_locality",
    "lon": 47.52158466,
    "lat": -18.86688795
  },
  "alarobia": {
    "id": "n_687168436",
    "name": "Alarobia",
    "source": "osm_suburb",
    "lon": 47.51847491,
    "lat": -18.87290438
  },
  "alasora": {
    "id": "n_687180726",
    "name": "Alasora",
    "source": "osm_suburb",
    "lon": 47.56509556,
    "lat": -18.95516895
  },
  "ambaniala": {
    "id": "n_5454040963",
    "name": "Ambaniala",
    "source": "osm_suburb",
    "lon": 47.48923688,
    "lat": -18.9213059
  },
  "ambanidia": {
    "id": "n_5680854302",
    "name": "Ambanidia",
    "source": "osm_suburb",
    "lon": 47.53962061,
    "lat": -18.91873985
  },
  "ambanilalana": {
    "id": "n_5454040949",
    "name": "Ambanilalana",
    "source": "osm_suburb",
    "lon": 47.48088191,
    "lat": -18.91864982
  },
  "ambanimaso": {
    "id": "rel_7772751",
    "name": "Ambanimaso",
    "source": "osm_admin",
    "lon": 47.4944255,
    "lat": -18.93987173
  },
  "ambanin'ampamarinana": {
    "id": "n_12504002875",
    "name": "Ambanin'Ampamarinana",
    "source": "osm_neighbourhood",
    "lon": 47.5291669,
    "lat": -18.92173285
  },
  "ambaranjana": {
    "id": "n_688357092",
    "name": "Ambaranjana",
    "source": "osm_neighbourhood",
    "lon": 47.54042852,
    "lat": -18.91176056
  },
  "ambato": {
    "id": "n_5535778698",
    "name": "Ambato",
    "source": "osm_neighbourhood",
    "lon": 47.48902405,
    "lat": -18.89220844
  },
  "ambatobe": {
    "id": "n_573536052",
    "name": "Ambatobe",
    "source": "osm_suburb",
    "lon": 47.55707441,
    "lat": -18.87929528
  },
  "ambatofahavalo": {
    "id": "rel_17812935",
    "name": "Ambatofahavalo",
    "source": "osm_admin",
    "lon": 47.61291282,
    "lat": -19.08599661
  },
  "ambatofotsy avaradrano": {
    "id": "n_7149564249",
    "name": "Ambatofotsy Avaradrano",
    "source": "osm_suburb",
    "lon": 47.57685389,
    "lat": -18.82723901
  },
  "ambatokaranana": {
    "id": "n_9112918006",
    "name": "Ambatokaranana",
    "source": "osm_neighbourhood",
    "lon": 47.54850365,
    "lat": -18.8979361
  },
  "ambatolampy": {
    "id": "n_4046331598",
    "name": "Ambatolampy",
    "source": "osm_neighbourhood",
    "lon": 47.44676236,
    "lat": -18.88710091
  },
  "ambatolampy antehiroka": {
    "id": "n_668739128",
    "name": "Ambatolampy Antehiroka",
    "source": "osm_suburb",
    "lon": 47.49224943,
    "lat": -18.84559322
  },
  "ambatomainty": {
    "id": "n_12504457193",
    "name": "Ambatomainty",
    "source": "osm_suburb",
    "lon": 47.53755784,
    "lat": -18.89039364
  },
  "ambatomaro": {
    "id": "n_681137790",
    "name": "Ambatomaro",
    "source": "osm_suburb",
    "lon": 47.56415435,
    "lat": -18.90246323
  },
  "ambatomena": {
    "id": "n_12504457190",
    "name": "Ambatomena",
    "source": "osm_neighbourhood",
    "lon": 47.52383117,
    "lat": -18.90801937
  },
  "ambatonakanga": {
    "id": "n_686543334",
    "name": "Ambatonakanga",
    "source": "osm_neighbourhood",
    "lon": 47.52735343,
    "lat": -18.91308797
  },
  "ambatondratemo": {
    "id": "n_13462289224",
    "name": "Ambatondratemo",
    "source": "osm_neighbourhood",
    "lon": 47.47686327,
    "lat": -18.92973947
  },
  "ambatonilita": {
    "id": "n_7122857438",
    "name": "Ambatonilita",
    "source": "osm_neighbourhood",
    "lon": 47.52187056,
    "lat": -18.91092789
  },
  "ambatoroka": {
    "id": "n_694070647",
    "name": "Ambatoroka",
    "source": "osm_suburb",
    "lon": 47.54195637,
    "lat": -18.92426728
  },
  "ambatoroka ambany": {
    "id": "n_12504002880",
    "name": "Ambatoroka Ambany",
    "source": "osm_neighbourhood",
    "lon": 47.54675968,
    "lat": -18.92326257
  },
  "ambatovinaky": {
    "id": "n_686543332",
    "name": "Ambatovinaky",
    "source": "osm_neighbourhood",
    "lon": 47.52977717,
    "lat": -18.91484838
  },
  "ambavahadimitafo": {
    "id": "n_686542283",
    "name": "Ambavahadimitafo",
    "source": "osm_neighbourhood",
    "lon": 47.53404888,
    "lat": -18.92146504
  },
  "ambavahaditokana": {
    "id": "n_931540836",
    "name": "Ambavahaditokana",
    "source": "osm_suburb",
    "lon": 47.46183493,
    "lat": -18.92361871
  },
  "ambavahaditokana afovoany": {
    "id": "n_13462289211",
    "name": "Ambavahaditokana Afovoany",
    "source": "osm_quarter",
    "lon": 47.46152596,
    "lat": -18.92654019
  },
  "ambavahaditokana andrefana": {
    "id": "n_13462289212",
    "name": "Ambavahaditokana Andrefana",
    "source": "osm_quarter",
    "lon": 47.45954521,
    "lat": -18.9268326
  },
  "ambavahaditokana atsimo": {
    "id": "n_13462289216",
    "name": "Ambavahaditokana Atsimo",
    "source": "osm_quarter",
    "lon": 47.45914308,
    "lat": -18.92949623
  },
  "ambilanibe": {
    "id": "n_6830616464",
    "name": "Ambilanibe",
    "source": "osm_neighbourhood",
    "lon": 47.5048191,
    "lat": -18.91995853
  },
  "amboatavo": {
    "id": "n_5454040955",
    "name": "Amboatavo",
    "source": "osm_suburb",
    "lon": 47.46600574,
    "lat": -18.91943684
  },
  "amboavahy": {
    "id": "n_668739134",
    "name": "Amboavahy",
    "source": "osm_suburb",
    "lon": 47.48113277,
    "lat": -18.85811931
  },
  "ambodavena": {
    "id": "n_931486392",
    "name": "Ambodavena",
    "source": "osm_neighbourhood",
    "lon": 47.47685296,
    "lat": -18.94782383
  },
  "ambodiafontsy": {
    "id": "n_687173784",
    "name": "Ambodiafontsy",
    "source": "osm_suburb",
    "lon": 47.46373938,
    "lat": -18.94090725
  },
  "ambodiamberivatry": {
    "id": "n_5454040965",
    "name": "Ambodiamberivatry",
    "source": "osm_suburb",
    "lon": 47.4857253,
    "lat": -18.90789744
  },
  "ambodiampanga itaosy": {
    "id": "n_5454040951",
    "name": "Ambodiampanga Itaosy",
    "source": "osm_neighbourhood",
    "lon": 47.48321533,
    "lat": -18.90456079
  },
  "ambodifasika": {
    "id": "n_5454111829",
    "name": "Ambodifasika",
    "source": "osm_suburb",
    "lon": 47.46158495,
    "lat": -18.90985632
  },
  "ambodifilao": {
    "id": "n_12504457191",
    "name": "Ambodifilao",
    "source": "osm_neighbourhood",
    "lon": 47.52604872,
    "lat": -18.90518133
  },
  "ambodihady": {
    "id": "n_668739138",
    "name": "Ambodihady",
    "source": "osm_suburb",
    "lon": 47.48088636,
    "lat": -18.8757591
  },
  "ambodihady carriere": {
    "id": "n_6673192563",
    "name": "Ambodihady Carriere",
    "source": "osm_neighbourhood",
    "lon": 47.48982885,
    "lat": -18.88014795
  },
  "ambodimanga": {
    "id": "n_5553415281",
    "name": "Ambodimanga",
    "source": "osm_neighbourhood",
    "lon": 47.5456078,
    "lat": -18.87999857
  },
  "ambodimita": {
    "id": "n_668739133",
    "name": "Ambodimita",
    "source": "osm_suburb",
    "lon": 47.48620048,
    "lat": -18.8667415
  },
  "ambodinisotry": {
    "id": "n_837558570",
    "name": "Ambodinisotry",
    "source": "osm_suburb",
    "lon": 47.51081654,
    "lat": -18.90722249
  },
  "ambodirano": {
    "id": "n_12504457181",
    "name": "Ambodirano",
    "source": "osm_suburb",
    "lon": 47.50009053,
    "lat": -18.91500102
  },
  "ambodirotra": {
    "id": "n_681393250",
    "name": "Ambodirotra",
    "source": "osm_neighbourhood",
    "lon": 47.53628237,
    "lat": -18.90940133
  },
  "amboditsiry": {
    "id": "n_681447076",
    "name": "Amboditsiry",
    "source": "osm_suburb",
    "lon": 47.53514856,
    "lat": -18.88324397
  },
  "ambodivoanjo": {
    "id": "n_687168434",
    "name": "Ambodivoanjo",
    "source": "osm_suburb",
    "lon": 47.53414041,
    "lat": -18.87539003
  },
  "ambodivoly atsimo": {
    "id": "n_13462289213",
    "name": "Ambodivoly Atsimo",
    "source": "osm_suburb",
    "lon": 47.45929305,
    "lat": -18.92497485
  },
  "ambodivoly avaratra": {
    "id": "n_13462289215",
    "name": "Ambodivoly Avaratra",
    "source": "osm_quarter",
    "lon": 47.45676932,
    "lat": -18.92593014
  },
  "ambodivona": {
    "id": "n_620818114",
    "name": "Ambodivona",
    "source": "osm_suburb",
    "lon": 47.52818625,
    "lat": -18.89209544
  },
  "ambodivondava": {
    "id": "n_7149564265",
    "name": "Ambodivondava",
    "source": "osm_suburb",
    "lon": 47.5521341,
    "lat": -18.82890761
  },
  "ambodivonkely": {
    "id": "n_668739147",
    "name": "Ambodivonkely",
    "source": "osm_suburb",
    "lon": 47.50477224,
    "lat": -18.88077593
  },
  "ambohibao": {
    "id": "n_668739130",
    "name": "Ambohibao",
    "source": "osm_suburb",
    "lon": 47.47535404,
    "lat": -18.84315241
  },
  "ambohibarikely": {
    "id": "n_837190453",
    "name": "Ambohibarikely",
    "source": "osm_suburb",
    "lon": 47.51726259,
    "lat": -18.92812161
  },
  "ambohibary namehana": {
    "id": "n_7149685723",
    "name": "Ambohibary Namehana",
    "source": "osm_suburb",
    "lon": 47.52532344,
    "lat": -18.82535753
  },
  "ambohibe": {
    "id": "n_2274967032",
    "name": "Ambohibe",
    "source": "osm_suburb",
    "lon": 47.57756434,
    "lat": -18.87942919
  },
  "ambohidahy": {
    "id": "n_844907666",
    "name": "Ambohidahy",
    "source": "osm_suburb",
    "lon": 47.55583526,
    "lat": -18.8950506
  },
  "ambohidavenona": {
    "id": "n_12504457163",
    "name": "Ambohidavenona",
    "source": "osm_neighbourhood",
    "lon": 47.45772789,
    "lat": -18.89409694
  },
  "ambohidralamabo": {
    "id": "n_13462289217",
    "name": "Ambohidralamabo",
    "source": "osm_quarter",
    "lon": 47.45457137,
    "lat": -18.93126473
  },
  "ambohidrapeto": {
    "id": "n_5531126587",
    "name": "Ambohidrapeto",
    "source": "osm_suburb",
    "lon": 47.46960531,
    "lat": -18.89854279
  },
  "ambohidraserika": {
    "id": "n_837197787",
    "name": "Ambohidraserika",
    "source": "osm_neighbourhood",
    "lon": 47.54603551,
    "lat": -18.93424723
  },
  "ambohidrazaka": {
    "id": "n_5796259520",
    "name": "Ambohidrazaka",
    "source": "osm_neighbourhood",
    "lon": 47.57792568,
    "lat": -18.94797529
  },
  "ambohidroa": {
    "id": "n_668739135",
    "name": "Ambohidroa",
    "source": "osm_suburb",
    "lon": 47.48624263,
    "lat": -18.85446287
  },
  "ambohijafy": {
    "id": "n_5454040964",
    "name": "Ambohijafy",
    "source": "osm_suburb",
    "lon": 47.48939708,
    "lat": -18.91107867
  },
  "ambohijanahary antehiroka": {
    "id": "n_12504457176",
    "name": "Ambohijanahary Antehiroka",
    "source": "osm_suburb",
    "lon": 47.50113712,
    "lat": -18.83207858
  },
  "ambohijanamasoandro": {
    "id": "n_12504457162",
    "name": "Ambohijanamasoandro",
    "source": "osm_neighbourhood",
    "lon": 47.47274532,
    "lat": -18.92244941
  },
  "ambohijatovo": {
    "id": "n_696956149",
    "name": "Ambohijatovo",
    "source": "osm_neighbourhood",
    "lon": 47.54156224,
    "lat": -18.87349974
  },
  "ambohikely": {
    "id": "n_13462289225",
    "name": "Ambohikely",
    "source": "osm_neighbourhood",
    "lon": 47.47643695,
    "lat": -18.93327427
  },
  "ambohimahitsy": {
    "id": "n_681137737",
    "name": "Ambohimahitsy",
    "source": "osm_suburb",
    "lon": 47.57171849,
    "lat": -18.89854326
  },
  "ambohimailala": {
    "id": "n_12851851333",
    "name": "Ambohimailala",
    "source": "osm_suburb",
    "lon": 47.5765224,
    "lat": -18.86630896
  },
  "ambohimamory": {
    "id": "n_687173778",
    "name": "Ambohimamory",
    "source": "osm_suburb",
    "lon": 47.48487143,
    "lat": -18.93071812
  },
  "ambohimanandray": {
    "id": "n_668739141",
    "name": "Ambohimanandray",
    "source": "osm_suburb",
    "lon": 47.49568736,
    "lat": -18.87136737
  },
  "ambohimanarina": {
    "id": "n_667624395",
    "name": "Ambohimanarina",
    "source": "osm_suburb",
    "lon": 47.50147913,
    "lat": -18.87475555
  },
  "ambohimandroso": {
    "id": "n_668739148",
    "name": "Ambohimandroso",
    "source": "osm_suburb",
    "lon": 47.49683008,
    "lat": -18.88331669
  },
  "ambohimandroso andrefana": {
    "id": "n_13462289218",
    "name": "Ambohimandroso Andrefana",
    "source": "osm_neighbourhood",
    "lon": 47.43489497,
    "lat": -18.92667588
  },
  "ambohimandroso atsinanana": {
    "id": "n_13462289219",
    "name": "Ambohimandroso Atsinanana",
    "source": "osm_suburb",
    "lon": 47.45124005,
    "lat": -18.92940094
  },
  "ambohimangidy": {
    "id": "n_687173774",
    "name": "Ambohimangidy",
    "source": "osm_suburb",
    "lon": 47.48016186,
    "lat": -18.96106639
  },
  "ambohimanoro": {
    "id": "n_686542284",
    "name": "Ambohimanoro",
    "source": "osm_neighbourhood",
    "lon": 47.5324639,
    "lat": -18.91676984
  },
  "ambohimarina": {
    "id": "n_13462289221",
    "name": "Ambohimarina",
    "source": "osm_neighbourhood",
    "lon": 47.46474418,
    "lat": -18.93453582
  },
  "ambohimiadana": {
    "id": "n_931486391",
    "name": "Ambohimiadana",
    "source": "osm_suburb",
    "lon": 47.44394621,
    "lat": -18.98986427
  },
  "ambohimiandra": {
    "id": "n_681393174",
    "name": "Ambohimiandra",
    "source": "osm_suburb",
    "lon": 47.54292533,
    "lat": -18.92926011
  },
  "ambohimirary": {
    "id": "n_687191172",
    "name": "Ambohimirary",
    "source": "osm_suburb",
    "lon": 47.55181567,
    "lat": -18.89741242
  },
  "ambohimitsimbina": {
    "id": "w_1311117945",
    "name": "Ambohimitsimbina",
    "source": "osm_suburb",
    "lon": 47.5308678,
    "lat": -18.92942979
  },
  "ambohimitsinjo": {
    "id": "n_668739150",
    "name": "Ambohimitsinjo",
    "source": "osm_suburb",
    "lon": 47.49448314,
    "lat": -18.87508658
  },
  "ambohinaorina": {
    "id": "n_5316748708",
    "name": "Ambohinaorina",
    "source": "osm_suburb",
    "lon": 47.55042523,
    "lat": -18.83511514
  },
  "ambohipanja": {
    "id": "n_5271851710",
    "name": "Ambohipanja",
    "source": "osm_suburb",
    "lon": 47.54709582,
    "lat": -18.84068526
  },
  "ambohipo": {
    "id": "n_5680854300",
    "name": "Ambohipo",
    "source": "osm_suburb",
    "lon": 47.55693545,
    "lat": -18.92701615
  },
  "ambohipo tanàna": {
    "id": "n_5680854867",
    "name": "Ambohipo Tanàna",
    "source": "osm_neighbourhood",
    "lon": 47.56333474,
    "lat": -18.933119
  },
  "ambohipotsy": {
    "id": "n_12504457189",
    "name": "Ambohipotsy",
    "source": "osm_neighbourhood",
    "lon": 47.53050248,
    "lat": -18.93113687
  },
  "ambohitrakely": {
    "id": "n_11224960451",
    "name": "Ambohitrakely",
    "source": "osm_suburb",
    "lon": 47.5436344,
    "lat": -18.9041002
  },
  "ambohitrarahaba": {
    "id": "n_687168440",
    "name": "Ambohitrarahaba",
    "source": "osm_suburb",
    "lon": 47.54561284,
    "lat": -18.86134636
  },
  "ambohitrimanjaka": {
    "id": "n_7176802092",
    "name": "Ambohitrimanjaka",
    "source": "osm_suburb",
    "lon": 47.4408433,
    "lat": -18.86607439
  },
  "ambohitrinimanga": {
    "id": "n_689610713",
    "name": "Ambohitrinimanga",
    "source": "osm_neighbourhood",
    "lon": 47.54345584,
    "lat": -18.88582599
  },
  "ambohitsoa": {
    "id": "n_686378273",
    "name": "Ambohitsoa",
    "source": "osm_suburb",
    "lon": 47.54193672,
    "lat": -18.94098996
  },
  "ambolonkandrina": {
    "id": "n_681137785",
    "name": "Ambolonkandrina",
    "source": "osm_suburb",
    "lon": 47.56152457,
    "lat": -18.92160899
  },
  "amboniloha": {
    "id": "n_687168429",
    "name": "Amboniloha",
    "source": "osm_neighbourhood",
    "lon": 47.52552156,
    "lat": -18.87009472
  },
  "ambonisoa": {
    "id": "n_5454040959",
    "name": "Ambonisoa",
    "source": "osm_neighbourhood",
    "lon": 47.48313976,
    "lat": -18.91263123
  },
  "ambovavady": {
    "id": "n_13816663284",
    "name": "Ambovavady",
    "source": "osm_quarter",
    "lon": 47.45478299,
    "lat": -18.82248421
  },
  "amoronakona": {
    "id": "n_9922907092",
    "name": "Amoronakona",
    "source": "osm_neighbourhood",
    "lon": 47.60253084,
    "lat": -18.93148687
  },
  "amorondria": {
    "id": "n_11923519763",
    "name": "Amorondria",
    "source": "osm_quarter",
    "lon": 47.5462027,
    "lat": -18.82809926
  },
  "ampahibe": {
    "id": "n_681428134",
    "name": "Ampahibe",
    "source": "osm_suburb",
    "lon": 47.53841209,
    "lat": -18.90887071
  },
  "ampamantanana androndrabe": {
    "id": "n_837197786",
    "name": "Ampamantanana Androndrabe",
    "source": "osm_suburb",
    "lon": 47.53627296,
    "lat": -18.94224228
  },
  "ampandrana": {
    "id": "n_687191170",
    "name": "Ampandrana",
    "source": "osm_suburb",
    "lon": 47.53399341,
    "lat": -18.90366457
  },
  "ampandrana atsinanana": {
    "id": "n_688357084",
    "name": "Ampandrana Atsinanana",
    "source": "osm_suburb",
    "lon": 47.53692895,
    "lat": -18.90562191
  },
  "ampandrianomby": {
    "id": "n_681428143",
    "name": "Ampandrianomby",
    "source": "osm_neighbourhood",
    "lon": 47.54753748,
    "lat": -18.90307965
  },
  "ampanefy": {
    "id": "n_931752003",
    "name": "Ampanefy",
    "source": "osm_suburb",
    "lon": 47.47885003,
    "lat": -18.98364101
  },
  "ampangabe": {
    "id": "n_5271851713",
    "name": "Ampangabe",
    "source": "osm_neighbourhood",
    "lon": 47.55209545,
    "lat": -18.84680409
  },
  "ampanotokana": {
    "id": "n_10559395465",
    "name": "Ampanotokana",
    "source": "osm_suburb",
    "lon": 47.55731218,
    "lat": -18.89971404
  },
  "amparibe": {
    "id": "n_617857577",
    "name": "Amparibe",
    "source": "osm_suburb",
    "lon": 47.52596721,
    "lat": -18.91598969
  },
  "ampasamadinika": {
    "id": "n_617341774",
    "name": "Ampasamadinika",
    "source": "osm_neighbourhood",
    "lon": 47.51979679,
    "lat": -18.90919472
  },
  "ampasampito": {
    "id": "n_681428140",
    "name": "Ampasampito",
    "source": "osm_suburb",
    "lon": 47.54526642,
    "lat": -18.89580164
  },
  "ampasanimalo": {
    "id": "n_11224960455",
    "name": "Ampasanimalo",
    "source": "osm_neighbourhood",
    "lon": 47.53998316,
    "lat": -18.91557441
  },
  "ampasanisadoda": {
    "id": "n_681393191",
    "name": "Ampasanisadoda",
    "source": "osm_neighbourhood",
    "lon": 47.53487229,
    "lat": -18.91288903
  },
  "ampasika": {
    "id": "n_738247099",
    "name": "Ampasika",
    "source": "osm_neighbourhood",
    "lon": 47.49715422,
    "lat": -18.90954135
  },
  "ampatsakana": {
    "id": "n_663240591",
    "name": "Ampatsakana",
    "source": "osm_neighbourhood",
    "lon": 47.51892113,
    "lat": -18.91169867
  },
  "ampefiloha": {
    "id": "n_837558571",
    "name": "Ampefiloha",
    "source": "osm_suburb",
    "lon": 47.51669827,
    "lat": -18.91433939
  },
  "ampetsapetsa": {
    "id": "n_687168435",
    "name": "Ampetsapetsa",
    "source": "osm_neighbourhood",
    "lon": 47.53265227,
    "lat": -18.86362004
  },
  "ampitatafika": {
    "id": "n_687173783",
    "name": "Ampitatafika",
    "source": "osm_suburb",
    "lon": 47.4787073,
    "lat": -18.93761306
  },
  "analakely": {
    "id": "n_574547485",
    "name": "Analakely",
    "source": "osm_suburb",
    "lon": 47.52688455,
    "lat": -18.90793337
  },
  "analamahitsy cité": {
    "id": "n_687168437",
    "name": "Analamahitsy Cité",
    "source": "osm_suburb",
    "lon": 47.54786304,
    "lat": -18.87117972
  },
  "analamahitsy tanàna": {
    "id": "n_5537450303",
    "name": "Analamahitsy Tanàna",
    "source": "osm_suburb",
    "lon": 47.54940343,
    "lat": -18.87692465
  },
  "anatihazo": {
    "id": "n_686376932",
    "name": "Anatihazo",
    "source": "osm_suburb",
    "lon": 47.51072214,
    "lat": -18.9153845
  },
  "andafiavaratra": {
    "id": "n_5271851714",
    "name": "Andafiavaratra",
    "source": "osm_suburb",
    "lon": 47.54897484,
    "lat": -18.85835428
  },
  "andavamamba": {
    "id": "n_686366948",
    "name": "Andavamamba",
    "source": "osm_suburb",
    "lon": 47.50904698,
    "lat": -18.9187492
  },
  "andohalo": {
    "id": "n_623449903",
    "name": "Andohalo",
    "source": "osm_suburb",
    "lon": 47.53114451,
    "lat": -18.91795023
  },
  "andohamandry": {
    "id": "n_12504457187",
    "name": "Andohamandry",
    "source": "osm_neighbourhood",
    "lon": 47.53369918,
    "lat": -18.93236929
  },
  "andohaniato": {
    "id": "n_837540703",
    "name": "Andohaniato",
    "source": "osm_neighbourhood",
    "lon": 47.56284339,
    "lat": -18.92539976
  },
  "andohanimandroseza": {
    "id": "n_5680854298",
    "name": "Andohanimandroseza",
    "source": "osm_suburb",
    "lon": 47.55228886,
    "lat": -18.92467452
  },
  "andoharanofotsy": {
    "id": "n_687180725",
    "name": "Andoharanofotsy",
    "source": "osm_suburb",
    "lon": 47.53437856,
    "lat": -18.97854706
  },
  "andohatanjona itaosy": {
    "id": "n_5454111830",
    "name": "Andohatanjona Itaosy",
    "source": "osm_suburb",
    "lon": 47.43517256,
    "lat": -18.90353935
  },
  "andohatapenaka": {
    "id": "n_686366965",
    "name": "Andohatapenaka",
    "source": "osm_suburb",
    "lon": 47.49767641,
    "lat": -18.90128737
  },
  "andombotany": {
    "id": "n_5271851711",
    "name": "Andombotany",
    "source": "osm_neighbourhood",
    "lon": 47.55486258,
    "lat": -18.84373363
  },
  "andraharo": {
    "id": "n_703740357",
    "name": "Andraharo",
    "source": "osm_suburb",
    "lon": 47.5081891,
    "lat": -18.88519559
  },
  "andrainarivo": {
    "id": "n_845962440",
    "name": "Andrainarivo",
    "source": "osm_neighbourhood",
    "lon": 47.54446452,
    "lat": -18.90869727
  },
  "andraisoro": {
    "id": "n_694182857",
    "name": "Andraisoro",
    "source": "osm_suburb",
    "lon": 47.55698736,
    "lat": -18.90705029
  },
  "andralanitra": {
    "id": "n_687180728",
    "name": "Andralanitra",
    "source": "osm_neighbourhood",
    "lon": 47.57445936,
    "lat": -18.90863096
  },
  "andramahafoitra": {
    "id": "n_5531126586",
    "name": "Andramahafoitra",
    "source": "osm_neighbourhood",
    "lon": 47.47319855,
    "lat": -18.89570274
  },
  "andramahavola": {
    "id": "n_5531126588",
    "name": "Andramahavola",
    "source": "osm_suburb",
    "lon": 47.47289055,
    "lat": -18.90245039
  },
  "andrangaranga": {
    "id": "n_837197783",
    "name": "Andrangaranga",
    "source": "osm_neighbourhood",
    "lon": 47.53786848,
    "lat": -18.93748274
  },
  "andranobevava": {
    "id": "n_687164483",
    "name": "Andranobevava",
    "source": "osm_neighbourhood",
    "lon": 47.541117,
    "lat": -18.88091887
  },
  "andranomanalina": {
    "id": "n_12504457183",
    "name": "Andranomanalina",
    "source": "osm_suburb",
    "lon": 47.51147487,
    "lat": -18.91036882
  },
  "andranomena": {
    "id": "n_5271851712",
    "name": "Andranomena",
    "source": "osm_neighbourhood",
    "lon": 47.55892765,
    "lat": -18.84851056
  },
  "andranonahoatra": {
    "id": "n_5454040957",
    "name": "Andranonahoatra",
    "source": "osm_suburb",
    "lon": 47.47469008,
    "lat": -18.91583352
  },
  "andranoro": {
    "id": "n_668739132",
    "name": "Andranoro",
    "source": "osm_suburb",
    "lon": 47.47237674,
    "lat": -18.86405246
  },
  "andranovory": {
    "id": "n_681137746",
    "name": "Andranovory",
    "source": "osm_neighbourhood",
    "lon": 47.57228611,
    "lat": -18.92498342
  },
  "andravako": {
    "id": "n_5414315205",
    "name": "Andravako",
    "source": "osm_neighbourhood",
    "lon": 47.46341732,
    "lat": -18.89227919
  },
  "andravoahangy": {
    "id": "n_687191160",
    "name": "Andravoahangy",
    "source": "osm_suburb",
    "lon": 47.53026807,
    "lat": -18.89868134
  },
  "andrefan'ambohijanahary": {
    "id": "n_686271702",
    "name": "Andrefan'Ambohijanahary",
    "source": "osm_suburb",
    "lon": 47.52036462,
    "lat": -18.92293469
  },
  "andrefantsena": {
    "id": "n_5316748707",
    "name": "Andrefantsena",
    "source": "osm_suburb",
    "lon": 47.55447795,
    "lat": -18.83731019
  },
  "androhibe": {
    "id": "n_687168433",
    "name": "Androhibe",
    "source": "osm_suburb",
    "lon": 47.54064713,
    "lat": -18.86484774
  },
  "androndrakely": {
    "id": "n_686378280",
    "name": "Androndrakely",
    "source": "osm_suburb",
    "lon": 47.53210165,
    "lat": -18.94717739
  },
  "andrononobe": {
    "id": "n_697186988",
    "name": "Andrononobe",
    "source": "osm_suburb",
    "lon": 47.55251101,
    "lat": -18.86791545
  },
  "angarangarana": {
    "id": "n_837191410",
    "name": "Angarangarana",
    "source": "osm_suburb",
    "lon": 47.5090765,
    "lat": -18.93503979
  },
  "angodongodona": {
    "id": "n_13816663283",
    "name": "Angodongodona",
    "source": "osm_quarter",
    "lon": 47.4308415,
    "lat": -18.8229388
  },
  "anjanahary": {
    "id": "n_687164484",
    "name": "Anjanahary",
    "source": "osm_suburb",
    "lon": 47.53719075,
    "lat": -18.89530881
  },
  "anjanatsimiova": {
    "id": "n_931486397",
    "name": "Anjanatsimiova",
    "source": "osm_neighbourhood",
    "lon": 47.47283268,
    "lat": -18.93938673
  },
  "anjeva gara": {
    "id": "rel_17812937",
    "name": "Anjeva Gara",
    "source": "osm_admin",
    "lon": 47.61904136,
    "lat": -18.92375112
  },
  "anjohy": {
    "id": "n_681393209",
    "name": "Anjohy",
    "source": "osm_neighbourhood",
    "lon": 47.5337297,
    "lat": -18.9181703
  },
  "ankadiaivo": {
    "id": "n_12504457169",
    "name": "Ankadiaivo",
    "source": "osm_neighbourhood",
    "lon": 47.54969203,
    "lat": -18.95067264
  },
  "ankadifotsy": {
    "id": "n_681227159",
    "name": "Ankadifotsy",
    "source": "osm_suburb",
    "lon": 47.52590848,
    "lat": -18.8966988
  },
  "ankadikely": {
    "id": "n_5143429980",
    "name": "Ankadikely",
    "source": "osm_suburb",
    "lon": 47.55349063,
    "lat": -18.85106042
  },
  "ankadilalampotsy": {
    "id": "n_12504457166",
    "name": "Ankadilalampotsy",
    "source": "osm_suburb",
    "lon": 47.53744766,
    "lat": -18.97204075
  },
  "ankadilalana": {
    "id": "n_694051796",
    "name": "Ankadilalana",
    "source": "osm_suburb",
    "lon": 47.52872495,
    "lat": -18.9249218
  },
  "ankadimbahoaka": {
    "id": "n_686271703",
    "name": "Ankadimbahoaka",
    "source": "osm_suburb",
    "lon": 47.52327312,
    "lat": -18.94384175
  },
  "ankadinandriana": {
    "id": "n_5592523471",
    "name": "Ankadinandriana",
    "source": "osm_suburb",
    "lon": 47.54758827,
    "lat": -18.96909958
  },
  "ankadindramamy": {
    "id": "n_687164486",
    "name": "Ankadindramamy",
    "source": "osm_quarter",
    "lon": 47.55924746,
    "lat": -18.89147146
  },
  "ankadindratombo": {
    "id": "n_681393181",
    "name": "Ankadindratombo",
    "source": "osm_suburb",
    "lon": 47.55654096,
    "lat": -18.94138133
  },
  "ankadindravola ivato": {
    "id": "n_12504457175",
    "name": "Ankadindravola Ivato",
    "source": "osm_suburb",
    "lon": 47.48580439,
    "lat": -18.82549791
  },
  "ankadirano": {
    "id": "n_5416457563",
    "name": "Ankadirano",
    "source": "osm_neighbourhood",
    "lon": 47.50492875,
    "lat": -18.97854497
  },
  "ankaditany": {
    "id": "n_931486387",
    "name": "Ankaditany",
    "source": "osm_suburb",
    "lon": 47.47057408,
    "lat": -18.95049423
  },
  "ankaditapaka": {
    "id": "n_12504457180",
    "name": "Ankaditapaka",
    "source": "osm_neighbourhood",
    "lon": 47.52353273,
    "lat": -18.89976699
  },
  "ankaditoho": {
    "id": "n_686159724",
    "name": "Ankaditoho",
    "source": "osm_suburb",
    "lon": 47.52972904,
    "lat": -18.94054635
  },
  "ankadivato": {
    "id": "n_681393255",
    "name": "Ankadivato",
    "source": "osm_suburb",
    "lon": 47.53418515,
    "lat": -18.90885763
  },
  "ankadivoribe": {
    "id": "n_931752004",
    "name": "Ankadivoribe",
    "source": "osm_suburb",
    "lon": 47.46984266,
    "lat": -19.03066211
  },
  "ankadivory": {
    "id": "n_837200474",
    "name": "Ankadivory",
    "source": "osm_neighbourhood",
    "lon": 47.54789608,
    "lat": -18.92866733
  },
  "ankandrina": {
    "id": "n_8862550402",
    "name": "Ankandrina",
    "source": "osm_neighbourhood",
    "lon": 47.56306752,
    "lat": -18.88531725
  },
  "ankasina": {
    "id": "n_686366969",
    "name": "Ankasina",
    "source": "osm_neighbourhood",
    "lon": 47.50411408,
    "lat": -18.89624969
  },
  "ankatso": {
    "id": "n_13337796213",
    "name": "Ankatso",
    "source": "osm_suburb",
    "lon": 47.5513246,
    "lat": -18.9156378
  },
  "ankazobe": {
    "id": "n_12504457170",
    "name": "Ankazobe",
    "source": "osm_neighbourhood",
    "lon": 47.58501086,
    "lat": -18.94135316
  },
  "ankazolava": {
    "id": "n_845947786",
    "name": "Ankazolava",
    "source": "osm_neighbourhood",
    "lon": 47.54147327,
    "lat": -18.94606639
  },
  "ankazomanga": {
    "id": "n_690711883",
    "name": "Ankazomanga",
    "source": "osm_suburb",
    "lon": 47.51132285,
    "lat": -18.89170399
  },
  "ankazotoho": {
    "id": "rel_7797863",
    "name": "Ankazotoho",
    "source": "osm_admin",
    "lon": 47.49807139,
    "lat": -18.94497009
  },
  "ankazotokana": {
    "id": "n_681393197",
    "name": "Ankazotokana",
    "source": "osm_suburb",
    "lon": 47.53613399,
    "lat": -18.91769281
  },
  "ankeniheny": {
    "id": "n_2724829809",
    "name": "Ankeniheny",
    "source": "osm_suburb",
    "lon": 47.52200575,
    "lat": -18.95309148
  },
  "ankerakely": {
    "id": "n_5552401830",
    "name": "Ankerakely",
    "source": "osm_neighbourhood",
    "lon": 47.53584395,
    "lat": -18.92767016
  },
  "ankerana": {
    "id": "n_687164481",
    "name": "Ankerana",
    "source": "osm_suburb",
    "lon": 47.55535331,
    "lat": -18.88639439
  },
  "ankorahotra": {
    "id": "n_688357090",
    "name": "Ankorahotra",
    "source": "osm_suburb",
    "lon": 47.53719139,
    "lat": -18.91433992
  },
  "ankoroby": {
    "id": "n_13462289220",
    "name": "Ankoroby",
    "source": "osm_neighbourhood",
    "lon": 47.46853338,
    "lat": -18.93250874
  },
  "ankorondrano": {
    "id": "n_844529035",
    "name": "Ankorondrano",
    "source": "osm_suburb",
    "lon": 47.52297701,
    "lat": -18.88518871
  },
  "anosibe": {
    "id": "n_686376916",
    "name": "Anosibe",
    "source": "osm_suburb",
    "lon": 47.51411695,
    "lat": -18.92340272
  },
  "anosimasina": {
    "id": "n_5454040967",
    "name": "Anosimasina",
    "source": "osm_suburb",
    "lon": 47.49306327,
    "lat": -18.9138355
  },
  "anosipatrana": {
    "id": "n_9878925459",
    "name": "Anosipatrana",
    "source": "osm_suburb",
    "lon": 47.49439222,
    "lat": -18.92976447
  },
  "anosisoa": {
    "id": "n_12504457178",
    "name": "Anosisoa",
    "source": "osm_suburb",
    "lon": 47.4918559,
    "lat": -18.87014843
  },
  "anosivavaka": {
    "id": "w_359369846",
    "name": "Anosivavaka",
    "source": "osm_neighbourhood",
    "lon": 47.50956003,
    "lat": -18.87666536
  },
  "anosizato andrefana": {
    "id": "n_686376924",
    "name": "Anosizato Andrefana",
    "source": "osm_suburb",
    "lon": 47.49581144,
    "lat": -18.9392337
  },
  "anosizato atsinanana": {
    "id": "n_728268650",
    "name": "Anosizato Atsinanana",
    "source": "osm_suburb",
    "lon": 47.50243126,
    "lat": -18.93833337
  },
  "anosy": {
    "id": "n_837558566",
    "name": "Anosy",
    "source": "osm_suburb",
    "lon": 47.51907887,
    "lat": -18.91763976
  },
  "antalata": {
    "id": "n_5281966844",
    "name": "Antalata",
    "source": "osm_suburb",
    "lon": 47.50258777,
    "lat": -18.98386187
  },
  "antananambony": {
    "id": "rel_7763796",
    "name": "Antananambony",
    "source": "osm_admin",
    "lon": 47.49741666,
    "lat": -18.9394194
  },
  "antanandrano": {
    "id": "n_5271851715",
    "name": "Antanandrano",
    "source": "osm_suburb",
    "lon": 47.53503502,
    "lat": -18.85195111
  },
  "antandrokomby": {
    "id": "n_5454040950",
    "name": "Antandrokomby",
    "source": "osm_neighbourhood",
    "lon": 47.49079314,
    "lat": -18.9056751
  },
  "antanety": {
    "id": "n_668739139",
    "name": "Antanety",
    "source": "osm_suburb",
    "lon": 47.49912499,
    "lat": -18.87249244
  },
  "antanety atsimo": {
    "id": "n_5271851716",
    "name": "Antanety Atsimo",
    "source": "osm_neighbourhood",
    "lon": 47.54736832,
    "lat": -18.8515261
  },
  "antanety avaratra": {
    "id": "n_5271851717",
    "name": "Antanety Avaratra",
    "source": "osm_neighbourhood",
    "lon": 47.54502433,
    "lat": -18.84621189
  },
  "antanimena": {
    "id": "n_843310804",
    "name": "Antanimena",
    "source": "osm_suburb",
    "lon": 47.52021667,
    "lat": -18.89678933
  },
  "antaninarenina": {
    "id": "n_574646963",
    "name": "Antaninarenina",
    "source": "osm_suburb",
    "lon": 47.52538879,
    "lat": -18.91031564
  },
  "antanjombe": {
    "id": "n_668739152",
    "name": "Antanjombe",
    "source": "osm_suburb",
    "lon": 47.50609101,
    "lat": -18.86798459
  },
  "antanjona": {
    "id": "n_13462289214",
    "name": "Antanjona",
    "source": "osm_quarter",
    "lon": 47.45425837,
    "lat": -18.91933393
  },
  "antohomadinika": {
    "id": "n_690711890",
    "name": "Antohomadinika",
    "source": "osm_suburb",
    "lon": 47.51599984,
    "lat": -18.90395748
  },
  "antsahabe": {
    "id": "n_11224960454",
    "name": "Antsahabe",
    "source": "osm_neighbourhood",
    "lon": 47.53337603,
    "lat": -18.91467879
  },
  "antsahakely": {
    "id": "n_5531126585",
    "name": "Antsahakely",
    "source": "osm_neighbourhood",
    "lon": 47.48092599,
    "lat": -18.88784804
  },
  "antsahamaina": {
    "id": "n_5271851704",
    "name": "Antsahamaina",
    "source": "osm_neighbourhood",
    "lon": 47.55393452,
    "lat": -18.86041915
  },
  "antsahamamy": {
    "id": "n_686539609",
    "name": "Antsahamamy",
    "source": "osm_neighbourhood",
    "lon": 47.55767521,
    "lat": -18.9165528
  },
  "antsahamarofoza": {
    "id": "n_7149685720",
    "name": "Antsahamarofoza",
    "source": "osm_suburb",
    "lon": 47.6046509,
    "lat": -18.83799472
  },
  "antsahameva": {
    "id": "n_5680854299",
    "name": "Antsahameva",
    "source": "osm_neighbourhood",
    "lon": 47.55016,
    "lat": -18.90963462
  },
  "antsahasoa": {
    "id": "n_10567187961",
    "name": "Antsahasoa",
    "source": "osm_suburb",
    "lon": 47.53463129,
    "lat": -18.96503057
  },
  "antsahatsiresy": {
    "id": "n_7149685730",
    "name": "Antsahatsiresy",
    "source": "osm_suburb",
    "lon": 47.56362755,
    "lat": -18.82636299
  },
  "antsahavola": {
    "id": "n_9758897058",
    "name": "Antsahavola",
    "source": "osm_neighbourhood",
    "lon": 47.52230347,
    "lat": -18.9090229
  },
  "antsahavolakely": {
    "id": "n_668739136",
    "name": "Antsahavolakely",
    "source": "osm_neighbourhood",
    "lon": 47.49694455,
    "lat": -18.85191753
  },
  "antsakaviro": {
    "id": "n_688357091",
    "name": "Antsakaviro",
    "source": "osm_suburb",
    "lon": 47.53663187,
    "lat": -18.91150027
  },
  "antsalovana": {
    "id": "n_837558569",
    "name": "Antsalovana",
    "source": "osm_neighbourhood",
    "lon": 47.51334708,
    "lat": -18.89816422
  },
  "antsampandrano": {
    "id": "n_12504457172",
    "name": "Antsampandrano",
    "source": "osm_suburb",
    "lon": 47.58137492,
    "lat": -18.84828288
  },
  "antsobolo": {
    "id": "n_681137748",
    "name": "Antsobolo",
    "source": "osm_neighbourhood",
    "lon": 47.56879992,
    "lat": -18.91267332
  },
  "antsofinondry": {
    "id": "n_5538613938",
    "name": "Antsofinondry",
    "source": "osm_suburb",
    "lon": 47.55740936,
    "lat": -18.82793149
  },
  "atendro": {
    "id": "n_12066924735",
    "name": "Atendro",
    "source": "osm_suburb",
    "lon": 47.55103452,
    "lat": -18.82284252
  },
  "atsimombohitra": {
    "id": "n_931486395",
    "name": "Atsimombohitra",
    "source": "osm_suburb",
    "lon": 47.4779925,
    "lat": -18.94271495
  },
  "atsinanantsena": {
    "id": "n_5316748706",
    "name": "Atsinanantsena",
    "source": "osm_suburb",
    "lon": 47.55764219,
    "lat": -18.83687293
  },
  "atsinanantsena ambohidrapeto": {
    "id": "n_5454040948",
    "name": "Atsinanantsena Ambohidrapeto",
    "source": "osm_suburb",
    "lon": 47.47801434,
    "lat": -18.90451619
  },
  "avarabohitra": {
    "id": "n_687173779",
    "name": "Avarabohitra",
    "source": "osm_suburb",
    "lon": 47.47912994,
    "lat": -18.92508804
  },
  "avaradoha": {
    "id": "n_681428137",
    "name": "Avaradoha",
    "source": "osm_suburb",
    "lon": 47.54400446,
    "lat": -18.90017377
  },
  "avaratanàna": {
    "id": "n_668739129",
    "name": "Avaratanàna",
    "source": "osm_suburb",
    "lon": 47.48537735,
    "lat": -18.83953232
  },
  "avaratetezana": {
    "id": "n_728268649",
    "name": "Avaratetezana",
    "source": "osm_suburb",
    "lon": 47.4822914,
    "lat": -18.93560127
  },
  "avaratr'antanimora": {
    "id": "n_681428157",
    "name": "Avaratr'Antanimora",
    "source": "osm_suburb",
    "lon": 47.54296344,
    "lat": -18.91367917
  },
  "avaratsena ambohidrapeto": {
    "id": "n_5454040952",
    "name": "Avaratsena Ambohidrapeto",
    "source": "osm_suburb",
    "lon": 47.47296884,
    "lat": -18.9079402
  },
  "behenjy": {
    "id": "n_5454040956",
    "name": "Behenjy",
    "source": "osm_neighbourhood",
    "lon": 47.47026332,
    "lat": -18.9113583
  },
  "behoririka": {
    "id": "n_837567373",
    "name": "Behoririka",
    "source": "osm_suburb",
    "lon": 47.52629659,
    "lat": -18.90204907
  },
  "bekiraro": {
    "id": "n_686366959",
    "name": "Bekiraro",
    "source": "osm_neighbourhood",
    "lon": 47.51431315,
    "lat": -18.9078555
  },
  "bel'air": {
    "id": "n_11224960453",
    "name": "Bel'air",
    "source": "osm_neighbourhood",
    "lon": 47.53271964,
    "lat": -18.90643224
  },
  "belanitra": {
    "id": "n_4206843240",
    "name": "Belanitra",
    "source": "osm_suburb",
    "lon": 47.52223664,
    "lat": -18.83985525
  },
  "bemasoandro": {
    "id": "n_5454040966",
    "name": "Bemasoandro",
    "source": "osm_suburb",
    "lon": 47.48670853,
    "lat": -18.91396644
  },
  "besarety": {
    "id": "n_688379376",
    "name": "Besarety",
    "source": "osm_suburb",
    "lon": 47.53615166,
    "lat": -18.90155065
  },
  "betafo": {
    "id": "n_668739140",
    "name": "Betafo",
    "source": "osm_suburb",
    "lon": 47.5022086,
    "lat": -18.87836075
  },
  "betongolo": {
    "id": "n_681428130",
    "name": "Betongolo",
    "source": "osm_suburb",
    "lon": 47.54021701,
    "lat": -18.90520997
  },
  "bevalala": {
    "id": "n_687180724",
    "name": "Bevalala",
    "source": "osm_neighbourhood",
    "lon": 47.51630032,
    "lat": -18.97813772
  },
  "bibilava": {
    "id": "n_5680854873",
    "name": "Bibilava",
    "source": "osm_neighbourhood",
    "lon": 47.56454737,
    "lat": -18.91666885
  },
  "building cité perrier": {
    "id": "w_148444594",
    "name": "Building cité Perrier",
    "source": "osm_neighbourhood",
    "lon": 47.53054391,
    "lat": -18.90326552
  },
  "cité itaosy akany sambatra": {
    "id": "n_5454040953",
    "name": "Cité Itaosy Akany Sambatra",
    "source": "osm_suburb",
    "lon": 47.47855265,
    "lat": -18.90957116
  },
  "cité militaire": {
    "id": "n_9735006975",
    "name": "Cité militaire",
    "source": "osm_locality",
    "lon": 47.55276182,
    "lat": -18.89058441
  },
  "cité planton": {
    "id": "n_688359813",
    "name": "Cité Planton",
    "source": "osm_neighbourhood",
    "lon": 47.54078478,
    "lat": -18.90910746
  },
  "faliarivo": {
    "id": "n_687173785",
    "name": "Faliarivo",
    "source": "osm_suburb",
    "lon": 47.46037908,
    "lat": -18.94790424
  },
  "faliarivo ii": {
    "id": "n_13462289226",
    "name": "Faliarivo II",
    "source": "osm_suburb",
    "lon": 47.47306034,
    "lat": -18.93179439
  },
  "famatanantsoa": {
    "id": "n_12062920445",
    "name": "Famatanantsoa",
    "source": "osm_locality",
    "lon": 47.53125919,
    "lat": -18.87129809
  },
  "faravohitra": {
    "id": "n_686545015",
    "name": "Faravohitra",
    "source": "osm_suburb",
    "lon": 47.52972315,
    "lat": -18.90851791
  },
  "fasan'ny karàna": {
    "id": "n_12504002878",
    "name": "Fasan'ny Karàna",
    "source": "osm_neighbourhood",
    "lon": 47.51381108,
    "lat": -18.94889738
  },
  "fenomanana": {
    "id": "n_837197788",
    "name": "Fenomanana",
    "source": "osm_neighbourhood",
    "lon": 47.54231536,
    "lat": -18.93313971
  },
  "fiadanana": {
    "id": "n_837191897",
    "name": "Fiadanana",
    "source": "osm_suburb",
    "lon": 47.52444488,
    "lat": -18.93346357
  },
  "fiombonana": {
    "id": "n_5531126582",
    "name": "Fiombonana",
    "source": "osm_neighbourhood",
    "lon": 47.47660061,
    "lat": -18.8955481
  },
  "fokontany manankasina": {
    "id": "n_6313190685",
    "name": "Fokontany Manankasina",
    "source": "osm_quarter",
    "lon": 47.48663217,
    "lat": -19.08217245
  },
  "fort duchesne": {
    "id": "n_5680854869",
    "name": "Fort Duchesne",
    "source": "osm_neighbourhood",
    "lon": 47.54696799,
    "lat": -18.91289368
  },
  "golan": {
    "id": "n_6673050118",
    "name": "Golan",
    "source": "osm_neighbourhood",
    "lon": 47.4909982,
    "lat": -18.87319168
  },
  "haute ville": {
    "id": "n_12504457188",
    "name": "Haute Ville",
    "source": "osm_suburb",
    "lon": 47.53101604,
    "lat": -18.92693771
  },
  "iadiambola": {
    "id": "n_687164487",
    "name": "Iadiambola",
    "source": "osm_neighbourhood",
    "lon": 47.54918623,
    "lat": -18.89354143
  },
  "iarinarivo": {
    "id": "rel_17812949",
    "name": "Iarinarivo",
    "source": "osm_admin",
    "lon": 47.42554808,
    "lat": -18.84544635
  },
  "iavoloha": {
    "id": "n_687180731",
    "name": "Iavoloha",
    "source": "osm_suburb",
    "lon": 47.53852348,
    "lat": -19.01774482
  },
  "ifarihy": {
    "id": "n_12504457167",
    "name": "Ifarihy",
    "source": "osm_suburb",
    "lon": 47.54769901,
    "lat": -18.9610491
  },
  "ikianja": {
    "id": "n_12504457174",
    "name": "Ikianja",
    "source": "osm_suburb",
    "lon": 47.59511234,
    "lat": -18.90805904
  },
  "ilafy": {
    "id": "n_12504457173",
    "name": "Ilafy",
    "source": "osm_suburb",
    "lon": 47.56585884,
    "lat": -18.85444388
  },
  "ilanivato": {
    "id": "n_686376928",
    "name": "Ilanivato",
    "source": "osm_suburb",
    "lon": 47.49979963,
    "lat": -18.92203463
  },
  "imerimanjaka": {
    "id": "n_12506457104",
    "name": "Imerimanjaka",
    "source": "osm_suburb",
    "lon": 47.55017358,
    "lat": -18.97864176
  },
  "imerinafovoany": {
    "id": "n_672735040",
    "name": "Imerinafovoany",
    "source": "osm_suburb",
    "lon": 47.46807633,
    "lat": -18.84004877
  },
  "isaingy": {
    "id": "n_931752002",
    "name": "Isaingy",
    "source": "osm_suburb",
    "lon": 47.49641038,
    "lat": -18.96929286
  },
  "isoraka": {
    "id": "n_620027471",
    "name": "Isoraka",
    "source": "osm_suburb",
    "lon": 47.52119441,
    "lat": -18.91306207
  },
  "isotry": {
    "id": "n_574265718",
    "name": "Isotry",
    "source": "osm_suburb",
    "lon": 47.51641297,
    "lat": -18.90973958
  },
  "itaosy": {
    "id": "n_687175200",
    "name": "Itaosy",
    "source": "osm_suburb",
    "lon": 47.47058585,
    "lat": -18.91784076
  },
  "ivandry": {
    "id": "n_687168428",
    "name": "Ivandry",
    "source": "osm_suburb",
    "lon": 47.52331803,
    "lat": -18.8775244
  },
  "ivolaniray": {
    "id": "n_12504457184",
    "name": "Ivolaniray",
    "source": "osm_neighbourhood",
    "lon": 47.50611264,
    "lat": -18.92745451
  },
  "madera namontana": {
    "id": "n_686271708",
    "name": "Madera Namontana",
    "source": "osm_suburb",
    "lon": 47.51806961,
    "lat": -18.93728804
  },
  "mahabo": {
    "id": "n_12506457106",
    "name": "Mahabo",
    "source": "osm_suburb",
    "lon": 47.53620993,
    "lat": -18.98674349
  },
  "mahalavolona": {
    "id": "n_12504457164",
    "name": "Mahalavolona",
    "source": "osm_suburb",
    "lon": 47.5242771,
    "lat": -18.98994557
  },
  "mahamasina": {
    "id": "n_574551024",
    "name": "Mahamasina",
    "source": "osm_suburb",
    "lon": 47.52435377,
    "lat": -18.91861966
  },
  "mahamasina atsimo": {
    "id": "n_12504002876",
    "name": "Mahamasina Atsimo",
    "source": "osm_neighbourhood",
    "lon": 47.52514576,
    "lat": -18.92312314
  },
  "mahatony": {
    "id": "n_687168427",
    "name": "Mahatony",
    "source": "osm_neighbourhood",
    "lon": 47.52564666,
    "lat": -18.86165688
  },
  "mahatsara": {
    "id": "n_3682650472",
    "name": "Mahatsara",
    "source": "osm_neighbourhood",
    "lon": 47.60344315,
    "lat": -18.88135955
  },
  "mahavoky": {
    "id": "n_687191168",
    "name": "Mahavoky",
    "source": "osm_neighbourhood",
    "lon": 47.53430338,
    "lat": -18.89935567
  },
  "mahazo": {
    "id": "n_687164485",
    "name": "Mahazo",
    "source": "osm_neighbourhood",
    "lon": 47.5621991,
    "lat": -18.89539419
  },
  "mahazoarivo": {
    "id": "n_686378306",
    "name": "Mahazoarivo",
    "source": "osm_suburb",
    "lon": 47.54693567,
    "lat": -18.94000206
  },
  "maibahoaka": {
    "id": "n_7184912074",
    "name": "Maibahoaka",
    "source": "osm_suburb",
    "lon": 47.4607621,
    "lat": -18.82938102
  },
  "malaho": {
    "id": "n_12504457165",
    "name": "Malaho",
    "source": "osm_suburb",
    "lon": 47.50930502,
    "lat": -18.97195743
  },
  "malaza": {
    "id": "n_687180730",
    "name": "Malaza",
    "source": "osm_neighbourhood",
    "lon": 47.52910699,
    "lat": -18.9718258
  },
  "manakambahiny": {
    "id": "n_845962439",
    "name": "Manakambahiny",
    "source": "osm_suburb",
    "lon": 47.53752661,
    "lat": -18.93112851
  },
  "manampisoa": {
    "id": "n_13462289223",
    "name": "Manampisoa",
    "source": "osm_suburb",
    "lon": 47.46169964,
    "lat": -18.93290578
  },
  "manandona": {
    "id": "n_9526189873",
    "name": "Manandona",
    "source": "osm_neighbourhood",
    "lon": 47.55074708,
    "lat": -18.99237257
  },
  "mananjara": {
    "id": "n_837191898",
    "name": "Mananjara",
    "source": "osm_suburb",
    "lon": 47.52310924,
    "lat": -18.92884128
  },
  "manarintsoa": {
    "id": "n_12504457182",
    "name": "Manarintsoa",
    "source": "osm_suburb",
    "lon": 47.51357984,
    "lat": -18.91324155
  },
  "manarintsoa namehana": {
    "id": "n_7149685724",
    "name": "Manarintsoa Namehana",
    "source": "osm_suburb",
    "lon": 47.53877553,
    "lat": -18.82694851
  },
  "mandrangobato": {
    "id": "n_837190450",
    "name": "Mandrangobato",
    "source": "osm_suburb",
    "lon": 47.51152635,
    "lat": -18.92896422
  },
  "mandriambero": {
    "id": "n_637715766",
    "name": "Mandriambero",
    "source": "osm_suburb",
    "lon": 47.43478476,
    "lat": -18.83411318
  },
  "mandroseza": {
    "id": "n_686378314",
    "name": "Mandroseza",
    "source": "osm_suburb",
    "lon": 47.5514328,
    "lat": -18.93379966
  },
  "mandrosoa": {
    "id": "n_923872934",
    "name": "Mandrosoa",
    "source": "osm_suburb",
    "lon": 47.56093453,
    "lat": -18.87143177
  },
  "mandrosoa ivato": {
    "id": "n_7798554173",
    "name": "Mandrosoa Ivato",
    "source": "osm_suburb",
    "lon": 47.47157285,
    "lat": -18.82553218
  },
  "mangarivotra": {
    "id": "n_686545016",
    "name": "Mangarivotra",
    "source": "osm_neighbourhood",
    "lon": 47.53207019,
    "lat": -18.91037506
  },
  "manjaka ilafy": {
    "id": "n_687168432",
    "name": "Manjaka Ilafy",
    "source": "osm_suburb",
    "lon": 47.55918731,
    "lat": -18.86001886
  },
  "manjakaray": {
    "id": "n_687168439",
    "name": "Manjakaray",
    "source": "osm_suburb",
    "lon": 47.53251732,
    "lat": -18.88904562
  },
  "marobiby": {
    "id": "n_5531126580",
    "name": "Marobiby",
    "source": "osm_suburb",
    "lon": 47.48033783,
    "lat": -18.8956876
  },
  "marohoho": {
    "id": "n_686159725",
    "name": "Marohoho",
    "source": "osm_neighbourhood",
    "lon": 47.53372052,
    "lat": -18.93654356
  },
  "mascar": {
    "id": "n_687191161",
    "name": "Mascar",
    "source": "osm_suburb",
    "lon": 47.53286728,
    "lat": -18.89584617
  },
  "masinandriana": {
    "id": "n_7149685718",
    "name": "Masinandriana",
    "source": "osm_suburb",
    "lon": 47.5671703,
    "lat": -18.87837279
  },
  "miadana": {
    "id": "n_12504457168",
    "name": "Miadana",
    "source": "osm_neighbourhood",
    "lon": 47.59194309,
    "lat": -18.96455142
  },
  "miandrarivo": {
    "id": "n_9758912238",
    "name": "Miandrarivo",
    "source": "osm_neighbourhood",
    "lon": 47.5372013,
    "lat": -18.92472498
  },
  "morarano": {
    "id": "n_837197782",
    "name": "Morarano",
    "source": "osm_suburb",
    "lon": 47.54026476,
    "lat": -18.93523058
  },
  "morondava": {
    "id": "n_668739131",
    "name": "Morondava",
    "source": "osm_suburb",
    "lon": 47.46544831,
    "lat": -18.85314235
  },
  "namehana": {
    "id": "n_7149685729",
    "name": "Namehana",
    "source": "osm_suburb",
    "lon": 47.54237553,
    "lat": -18.83182217
  },
  "nanisana": {
    "id": "n_681434750",
    "name": "Nanisana",
    "source": "osm_suburb",
    "lon": 47.54839562,
    "lat": -18.88810006
  },
  "ouest mananjara": {
    "id": "n_12504457185",
    "name": "Ouest Mananjara",
    "source": "osm_suburb",
    "lon": 47.51699648,
    "lat": -18.93240926
  },
  "presidential place": {
    "id": "n_4371790027",
    "name": "Presidential Place",
    "source": "osm_locality",
    "lon": 47.52376151,
    "lat": -18.91236414
  },
  "sakanambazo": {
    "id": "n_5531126579",
    "name": "Sakanambazo",
    "source": "osm_neighbourhood",
    "lon": 47.48489003,
    "lat": -18.8997717
  },
  "saropody": {
    "id": "n_12061261553",
    "name": "Saropody",
    "source": "osm_neighbourhood",
    "lon": 47.53745086,
    "lat": -18.95359941
  },
  "seranina": {
    "id": "n_5271851709",
    "name": "Seranina",
    "source": "osm_neighbourhood",
    "lon": 47.53922175,
    "lat": -18.83993068
  },
  "soamanandrariny": {
    "id": "n_687164488",
    "name": "Soamanandrariny",
    "source": "osm_suburb",
    "lon": 47.5670229,
    "lat": -18.89024504
  },
  "soaniadanana": {
    "id": "n_7149685731",
    "name": "Soaniadanana",
    "source": "osm_suburb",
    "lon": 47.5620144,
    "lat": -18.84159805
  },
  "soanierana": {
    "id": "n_686271697",
    "name": "Soanierana",
    "source": "osm_suburb",
    "lon": 47.52391421,
    "lat": -18.93838268
  },
  "soarano": {
    "id": "n_837567376",
    "name": "Soarano",
    "source": "osm_suburb",
    "lon": 47.52118296,
    "lat": -18.90325226
  },
  "soavimasoandro": {
    "id": "n_687168430",
    "name": "Soavimasoandro",
    "source": "osm_suburb",
    "lon": 47.51451404,
    "lat": -18.85551482
  },
  "soavimbahoaka": {
    "id": "n_681434761",
    "name": "Soavimbahoaka",
    "source": "osm_neighbourhood",
    "lon": 47.54189322,
    "lat": -18.89138189
  },
  "soavina": {
    "id": "n_931752010",
    "name": "Soavina",
    "source": "osm_suburb",
    "lon": 47.50252857,
    "lat": -18.95837576
  },
  "soavinandriana": {
    "id": "n_12504457192",
    "name": "Soavinandriana",
    "source": "osm_neighbourhood",
    "lon": 47.5409755,
    "lat": -18.89743545
  },
  "talatamaty": {
    "id": "n_672735082",
    "name": "Talatamaty",
    "source": "osm_suburb",
    "lon": 47.45050513,
    "lat": -18.84341657
  },
  "tangaina": {
    "id": "n_687173781",
    "name": "Tangaina",
    "source": "osm_neighbourhood",
    "lon": 47.4860392,
    "lat": -18.94507051
  },
  "tanjombato": {
    "id": "n_687180729",
    "name": "Tanjombato",
    "source": "osm_suburb",
    "lon": 47.52701684,
    "lat": -18.95874513
  },
  "tongarivo": {
    "id": "n_694218753",
    "name": "Tongarivo",
    "source": "osm_suburb",
    "lon": 47.52371587,
    "lat": -18.96621786
  },
  "tsarafara": {
    "id": "n_5316748705",
    "name": "Tsarafara",
    "source": "osm_suburb",
    "lon": 47.5649075,
    "lat": -18.83591265
  },
  "tsarafaritra tsimbazaza": {
    "id": "n_681393166",
    "name": "Tsarafaritra Tsimbazaza",
    "source": "osm_suburb",
    "lon": 47.5289058,
    "lat": -18.93468323
  },
  "tsarahonenana": {
    "id": "n_5680854207",
    "name": "Tsarahonenana",
    "source": "osm_suburb",
    "lon": 47.5512819,
    "lat": -18.90365164
  },
  "tsaralalàna": {
    "id": "n_574539686",
    "name": "Tsaralalàna",
    "source": "osm_suburb",
    "lon": 47.5198171,
    "lat": -18.9063838
  },
  "tsaramasay": {
    "id": "n_844529031",
    "name": "Tsaramasay",
    "source": "osm_neighbourhood",
    "lon": 47.51734801,
    "lat": -18.89045031
  },
  "tsararay lailava": {
    "id": "n_13462289210",
    "name": "Tsararay Lailava",
    "source": "osm_suburb",
    "lon": 47.46093732,
    "lat": -18.92480413
  },
  "tsararivotra": {
    "id": "n_11987385329",
    "name": "Tsararivotra",
    "source": "osm_neighbourhood",
    "lon": 47.57312617,
    "lat": -19.06310491
  },
  "tsarasaotra": {
    "id": "n_687168431",
    "name": "Tsarasaotra",
    "source": "osm_neighbourhood",
    "lon": 47.51487695,
    "lat": -18.86768807
  },
  "tsiadana": {
    "id": "n_681400105",
    "name": "Tsiadana",
    "source": "osm_suburb",
    "lon": 47.54534094,
    "lat": -18.91843925
  },
  "tsilazaina": {
    "id": "n_12506457103",
    "name": "Tsilazaina",
    "source": "osm_neighbourhood",
    "lon": 47.59114034,
    "lat": -19.00102737
  },
  "tsimialonjafy": {
    "id": "n_12504002874",
    "name": "Tsimialonjafy",
    "source": "osm_neighbourhood",
    "lon": 47.52915443,
    "lat": -18.91927169
  },
  "village akamasoa": {
    "id": "n_6782874587",
    "name": "Village Akamasoa",
    "source": "osm_neighbourhood",
    "lon": 47.5787167,
    "lat": -18.89240186
  },
  "vinany": {
    "id": "n_13462289227",
    "name": "Vinany",
    "source": "osm_suburb",
    "lon": 47.47159123,
    "lat": -18.92691525
  },
  "volosarika": {
    "id": "n_681393224",
    "name": "Volosarika",
    "source": "osm_neighbourhood",
    "lon": 47.53920996,
    "lat": -18.92157817
  },
  "volotara": {
    "id": "n_12509205379",
    "name": "Volotara",
    "source": "osm_suburb",
    "lon": 47.52456434,
    "lat": -18.97808425
  },
  "vonelina": {
    "id": "n_5531126581",
    "name": "Vonelina",
    "source": "osm_neighbourhood",
    "lon": 47.47266386,
    "lat": -18.88500079
  }
}
