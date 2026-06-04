// 補助金かんたん検索ツール - Cloudflare Worker

const AGRI = [
  {id:"agr001",name:"環境保全型農業直接支払交付金",category:"有機・自然栽培",area:["全国"],style:["有機・自然栽培"],jouno:["既存農家","新規就農"],purpose:["有機転換","環境対応"],amount:"8,000円/10a（有機農業）",rate:"定額",deadline:"2027-03-31",status:"受付中",url:"https://www.maff.go.jp/j/seisan/kankyo/hozen_type/",note:"有機JAS・自然栽培農業者が対象。都道府県経由で申請",
   guide:{steps:["都道府県の農業振興課（または農政局）に相談・事前確認","申請書類を準備する（4〜5月が申請時期の目安）","農業委員会・集落の確認を得る（複数農家での申請が有利）","都道府県へ申請書を提出","審査・交付決定（約1〜2ヶ月）","有機農業・堆肥施用等の取組を実施","翌年度に実績報告書を提出"],docs:["申請者の身分証明・農業者確認書類","農地の地番・面積一覧（農業委員会発行）","取組内容の説明書（有機農業の場合は栽培計画）","直近の農業収入がわかる確定申告書または農業台帳"],agency:"各都道府県農業振興課・農政局",caution:"有機JAS認証は必須ではない（国際水準を満たす有機農業であればOK）。複数農家での集落ぐるみの取組が採択に有利。"}},
  {id:"agr002",name:"農業次世代人材投資資金",category:"就農支援",area:["全国"],style:["通常栽培","有機・自然栽培","施設栽培"],jouno:["新規就農","就農前"],purpose:["就農支援"],amount:"年間150万円（最長2年）",rate:"定額",deadline:"随時",status:"受付中",url:"https://www.maff.go.jp/j/new_farmer/new_farm/",note:"50歳未満対象。就農後の経営開始型は最長5年間給付",
   guide:{steps:["市町村の農業委員会または農政課に相談","就農計画書を作成する（農業委員会が指導してくれる）","申請書類を揃えて市町村へ提出","都道府県で審査（1〜2ヶ月）","交付決定→就農スタート・毎月給付","毎年、就農状況の確認（計画通り進んでいるか）"],docs:["就農計画書（所定の様式・農業委員会で入手）","戸籍謄本（年齢確認・50歳未満であること）","研修実績の証明書（農業大学校・農家研修先等）","住民票"],agency:"市町村農業委員会・都道府県農業振興課",caution:"50歳未満が絶対条件。就農計画の達成状況を毎年審査されるため、計画は現実的に設定すること。就農1年目は「経営開始型」で年間120〜150万円受給可能。"}},
  {id:"agr003",name:"強い農業・担い手づくり総合支援交付金",category:"農機・施設導入",area:["全国"],style:["通常栽培","有機・自然栽培","施設栽培"],jouno:["既存農家","新規就農"],purpose:["農機購入","施設整備"],amount:"事業費の1/2〜3/4",rate:"1/2〜3/4",deadline:"随時（都道府県経由）",status:"受付中",url:"https://www.maff.go.jp/j/kobetu_ninaite/n_kousin/",note:"担い手農家・農業法人が対象。農機・施設導入に活用可",
   guide:{steps:["都道府県の農政課・農政局に事前相談（採択枠の確認）","事業計画書を作成（導入する農機・施設の内容・効果）","見積書を2社以上から取得","都道府県へ申請書を提出・審査","採択決定後に農機・施設を発注・導入","実績報告書を提出"],docs:["事業計画書（様式は都道府県から入手）","農機・施設の見積書（2社以上の相見積が必要）","認定農業者証または集落営農規約のコピー","農地の所有・利用状況がわかる書類"],agency:"地方農政局・都道府県農業振興課",caution:"認定農業者・集落営農組合・農業法人など「担い手」要件あり。採択競争があるため、事業の必要性・効果を具体的に書くことが重要。"}},
  {id:"agr004",name:"農山漁村振興交付金（6次産業化・農泊）",category:"6次産業・販路",area:["全国"],style:["通常栽培","有機・自然栽培"],jouno:["既存農家"],purpose:["販路拡大","6次産業化"],amount:"最大5,000万円",rate:"定額",deadline:"随時",status:"受付中",url:"https://www.maff.go.jp/j/nousin/sonsyu/",note:"農泊・農産物加工・直売所設置等の6次産業化を支援",
   guide:{steps:["都道府県農政局に事前相談（公募時期の確認）","事業計画書を作成（加工・販売・農泊等の計画）","関係機関（市町村・農業団体）と連携計画を確認","申請書提出・審査","採択後に施設整備・事業実施","実績報告書を提出"],docs:["事業計画書（施設整備の内容・事業収支計画）","施設の設計図・見積書","農産物の生産・販売実績がわかる資料","共同申請の場合は構成員リスト"],agency:"地方農政局・都道府県農業振興課",caution:"農泊・加工施設・直売所など「6次産業化」の取組が対象。単なる農機購入はこの交付金では対象外。"}},
  {id:"agr005",name:"スマート農業実証プロジェクト",category:"IT・スマート農業",area:["全国"],style:["通常栽培","施設栽培"],jouno:["既存農家","新規就農"],purpose:["IT化","農機購入"],amount:"定額（採択次第）",rate:"定額",deadline:"年度ごと公募",status:"要確認",url:"https://www.naro.go.jp/project/smart_agri/",note:"農研機構が公募。ドローン・センサー・自動農機の実証に",
   guide:{steps:["農研機構のWebサイトで公募情報を確認（年1〜2回公募）","技術企業・大学等との共同提案チームを組む","実証計画書を作成（何をどう実証するか）","農研機構へ申請・審査","採択後に実証実験を実施","実証報告書を農研機構へ提出"],docs:["実証計画書（農研機構の様式）","共同実施機関との合意書","農地・圃場の情報（場所・面積・作物）","過去の農業経営実績資料"],agency:"国立研究開発法人農業・食品産業技術総合研究機構（農研機構）",caution:"農業者だけでなく、ドローン・センサー等の技術企業との共同申請が基本。単独申請は難しい。"}},
  {id:"agr006",name:"遊佐町新規就農支援（生活支援金・住宅無償貸与）",category:"就農支援（遊佐町）",area:["遊佐町"],style:["通常栽培","有機・自然栽培"],jouno:["新規就農","就農前"],purpose:["就農支援"],amount:"月5万円＋住宅無償貸与（最長2年）",rate:"定額",deadline:"随時",status:"受付中",url:"https://www.yuza-iju.com/aguri-support/",note:"遊佐町へのIJUターン就農者が対象。産業課農業振興係に相談",
   guide:{steps:["遊佐町産業課農業振興係に電話・相談（TEL: 0234-72-5882）","遊佐町への移住（住民票移転）を確認","就農計画書を作成（農業振興係が支援してくれる）","申請書を産業課へ提出","審査・決定後、毎月の生活支援金の受給スタート","住宅を無償で借りて農業研修・就農を開始"],docs:["遊佐町の住民票（移住が前提）","就農計画書（窓口で様式入手）","農業研修の予定・実績がわかる書類","本人の身分証明書"],agency:"遊佐町産業課農業振興係（TEL: 0234-72-5882）",caution:"IJUターン（移住）が条件。遊佐町への住民票移転が必須。国の「農業次世代人材投資資金」と組み合わせると月額200万円近い支援が受けられる場合あり。"}},
  {id:"agr007",name:"山形県有機農業推進対策事業",category:"有機農業支援（山形県）",area:["山形県","遊佐町"],style:["有機・自然栽培"],jouno:["既存農家","新規就農"],purpose:["有機転換","農機購入"],amount:"補助率等は年度ごとに確認",rate:"要確認",deadline:"年度ごと",status:"要確認",url:"https://www.pref.yamagata.jp/140001/sangyo/nourinsuisangyou/nogyo/",note:"山形県農業振興課に要問い合わせ",
   guide:{steps:["山形県農業振興課（農政部）に電話・問い合わせ","年度ごとの公募情報を確認（3〜4月が申請時期の目安）","申請書類を準備","山形県農業振興課へ申請書提出","審査・採択決定","事業実施・実績報告"],docs:["申請書（山形県の窓口または公式サイトから入手）","有機農業の取組計画書","農地の地番・面積一覧","直近の農業収入がわかる資料"],agency:"山形県農業振興課（023-630-2454）",caution:"年度ごとに内容・補助率が変わる可能性あり。必ず電話で最新情報を確認すること。"}},
  {id:"agr008",name:"農業経営基盤強化資金（スーパーL資金）",category:"低利融資",area:["全国"],style:["通常栽培","有機・自然栽培","施設栽培"],jouno:["既存農家","新規就農"],purpose:["農機購入","施設整備"],amount:"3億円（個人）",rate:"融資（低利）",deadline:"随時",status:"受付中",url:"https://www.jfc.go.jp/n/finance/search/agri_s.html",note:"農協・銀行経由で申請。農業近代化資金も並行確認を",
   guide:{steps:["最寄りの農協（JA）または農林漁業者向け金融機関に相談","融資計画書・事業計画書を作成","農業委員会で「認定農業者」の確認","金融機関へ融資申込","審査・融資決定","農機・施設を購入・設置"],docs:["認定農業者証（または認定新規就農者証）","事業計画書（農機・施設の導入計画と収支計画）","直近3期分の確定申告書・収支計算書","農地の登記簿謄本または賃貸借契約書"],agency:"農協（JA）・日本政策金融公庫（農林漁業セクション）",caution:"「補助金」ではなく「低利融資」。返済が必要だが金利が非常に低い（スーパーL資金は当初5年間無利子）。補助金と組み合わせて活用するのがベスト。"}}
];

const BIZ = [
  {id:"biz001",name:"ものづくり補助金",category:"設備投資",area:["全国"],type:["個人事業主","法人"],industry:["製造業","建設業","IT","サービス業","小売・飲食"],max_emp:999,purpose:["設備投資","IT導入"],amount:"最大1,250万円",rate:"1/2〜2/3",deadline:"随時（複数回）",status:"受付中",url:"https://portal.monodukuri-hojo.jp/",note:"認定支援機関の関与が必要。電子申請のみ",
   guide:{steps:["GビズIDプライムを取得する（⚠️2〜3週間かかるため最優先で着手）","認定経営革新等支援機関（認定支援機関）を探して相談する","事業計画書を作成する（10〜15枚程度・所定の様式あり）","補助金申請システム（jGrants）から電子申請","採択発表（公募締切から約2〜3ヶ月後）","採択後に補助事業（設備導入等）を実施","実績報告書を提出して補助金を受け取る"],docs:["GビズIDプライム（必須・事前取得要）","確定申告書または決算書（直近2期分）","事業計画書（公式サイトの様式に沿う）","設備・機械の見積書（2社以上の相見積）","賃金台帳のコピー（賃上げ表明書と合わせて）"],agency:"全国中小企業団体中央会（公式サイト: portal.monodukuri-hojo.jp）",caution:"GビズIDの取得が一番の落とし穴。申請を思い立ったら真っ先に取得手続きを始めること。認定支援機関の関与なしでは申請不可。紙申請は受け付けていない。"}},
  {id:"biz002",name:"IT導入補助金",category:"IT・デジタル化",area:["全国"],type:["個人事業主","法人"],industry:["製造業","建設業","IT","サービス業","小売・飲食"],max_emp:300,purpose:["IT導入"],amount:"最大450万円",rate:"1/2〜3/4",deadline:"随時（複数回）",status:"受付中",url:"https://www.it-hojo.jp/",note:"対象のITベンダーと共同申請。IT導入支援事業者が必要",
   guide:{steps:["GビズIDプライムを取得する（事前に必要）","IT導入支援事業者（登録ベンダー）を公式サイトで探す","ベンダーに相談・見積を取る（ベンダーが申請を主導してくれる）","ベンダーと共同で申請書を作成・提出","採択後にITツールを導入・支払い","実績報告をベンダーと共同で提出"],docs:["GビズIDプライム","確定申告書（直近1期分）","ITツールの見積書・提案書（ベンダーが準備）"],agency:"IT導入補助金事務局（公式サイト: it-hojo.jp）",caution:"自分だけでは申請できない。必ず公式サイトに登録された「IT導入支援事業者」と組む必要がある。ベンダーが申請を主導してくれるため、まずベンダー探しから始めるとスムーズ。"}},
  {id:"biz003",name:"小規模事業者持続化補助金",category:"販路開拓",area:["全国"],type:["個人事業主","法人"],industry:["製造業","建設業","IT","サービス業","小売・飲食"],max_emp:20,purpose:["販路拡大","IT導入"],amount:"最大200万円",rate:"2/3",deadline:"随時（複数回）",status:"受付中",url:"https://s23.jizokukahojokin.info/",note:"商工会・商工会議所の助言を受けて申請。小規模事業者専用",
   guide:{steps:["地元の商工会または商工会議所に行って相談する（⚠️これが最初のステップ）","経営計画書・補助事業計画書を作成する（商工会が支援してくれる）","商工会の「事業支援計画書」を発行してもらう（必須）","jGrantsから電子申請（または郵送申請）","採択後に補助事業（チラシ印刷・ECサイト構築等）を実施","実績報告書を提出して補助金を受け取る"],docs:["経営計画書・補助事業計画書（所定様式）","商工会または商工会議所の事業支援計画書（必須）","確定申告書（直近1期分）","見積書（補助事業の費用）"],agency:"商工会・商工会議所（地元の窓口）",caution:"従業員20人以下（小売・サービス業は5人以下）の小規模事業者専用。商工会の印鑑（事業支援計画書）がないと申請できない。まず商工会への加入・相談が必須。"}},
  {id:"biz004",name:"事業再構築補助金",category:"業態転換",area:["全国"],type:["個人事業主","法人"],industry:["製造業","建設業","IT","サービス業","小売・飲食"],max_emp:999,purpose:["業態転換","設備投資"],amount:"最大1,500万円（通常枠）",rate:"1/2〜2/3",deadline:"要確認",status:"要確認",url:"https://jigyou-saikouchiku.go.jp/",note:"現在の公募状況を公式で要確認",
   guide:{steps:["公式サイトで現在の公募状況を確認（公募終了の可能性あり）","認定支援機関に相談・事業計画書の作成支援を依頼","売上減少の証明資料を準備","事業再構築の具体的な計画を立てる","jGrantsから電子申請","採択後に新事業を実施","実績報告を提出"],docs:["GビズIDプライム","確定申告書（直近2期分）","売上減少がわかる試算表・月次売上資料","事業再構築計画書（所定様式）","認定支援機関の確認書"],agency:"中小企業庁（事業再構築補助金事務局）",caution:"現在は公募が終了・縮小している可能性あり。必ず公式サイトで最新の公募状況を確認すること。"}},
  {id:"biz005",name:"省エネルギー投資促進補助金",category:"省エネ・環境",area:["全国"],type:["個人事業主","法人"],industry:["製造業","建設業","サービス業"],max_emp:999,purpose:["省エネ","設備投資"],amount:"最大1億円",rate:"1/3〜1/2",deadline:"年度ごと公募",status:"受付中",url:"https://sii.or.jp/",note:"省エネ設備・高効率機器の導入に。SIIが採択機関",
   guide:{steps:["省エネ診断を受ける（任意だが有利）","SII（一般社団法人環境共創イニシアチブ）の公式サイトで公募情報を確認","省エネ効果の試算を行う（専門家に依頼すると確実）","申請書類を作成・提出（電子申請）","採択後に省エネ設備を導入","省エネ効果の実績報告を提出"],docs:["申請書（SII様式）","省エネルギー計算書（導入前後の省エネ効果）","設備の仕様書・カタログ","見積書（2社以上の相見積）"],agency:"一般社団法人環境共創イニシアチブ（SII）公式サイト: sii.or.jp",caution:"省エネ効果の計算が審査の核心。事前にしっかり計算・根拠を示すことが採択のポイント。"}},
  {id:"biz006",name:"山形県創業支援補助金",category:"創業支援",area:["山形県","遊佐町"],type:["個人事業主","法人"],industry:["製造業","建設業","IT","サービス業","小売・飲食"],max_emp:20,purpose:["創業"],amount:"最大200万円（地域により異なる）",rate:"1/2〜2/3",deadline:"随時",status:"受付中",url:"https://www.pref.yamagata.jp/020042/shigoto/sangyo/kigyosupport/",note:"商工会・よろず支援拠点経由。県と市町村の両方チェックを",
   guide:{steps:["山形県よろず支援拠点または地元商工会に相談","創業計画書を作成（事業内容・収支計画）","補助事業計画書を作成","申請書を山形県または市町村窓口に提出","審査・採択決定","創業・補助事業を実施","実績報告書を提出"],docs:["創業計画書（所定様式）","補助事業計画書（補助金の使い道・効果）","見積書","代表者の身分証明書・住民票"],agency:"山形県産業労働部 / 地元商工会・よろず支援拠点（0120-664-258）",caution:"山形県の補助金と市町村単独の補助金を両方確認すること。創業後の事業計画の具体性が審査で重視される。"}},
  {id:"biz007",name:"山形県中小企業デジタル化支援",category:"IT（山形県）",area:["山形県","遊佐町"],type:["個人事業主","法人"],industry:["製造業","建設業","IT","サービス業","小売・飲食"],max_emp:300,purpose:["IT導入"],amount:"要確認",rate:"要確認",deadline:"年度ごと",status:"要確認",url:"https://www.pref.yamagata.jp/020042/shigoto/sangyo/chuushoukigyou/",note:"山形県産業労働部に要問い合わせ",
   guide:{steps:["山形県産業労働部（023-630-2314）に電話で最新情報を確認","公募開始後に申請書類を入手","ITツール導入の計画書を作成","山形県へ申請","採択後にITツールを導入","実績報告書を提出"],docs:["申請書（山形県窓口またはサイトから入手）","ITツール導入計画書","見積書","直近の決算書または確定申告書"],agency:"山形県産業労働部 中小企業振興課（023-630-2314）",caution:"年度ごとに内容・補助率・公募時期が変わる。必ず電話で最新情報を確認してから動くこと。"}},
  {id:"biz008",name:"雇用調整助成金",category:"雇用・人材",area:["全国"],type:["個人事業主","法人"],industry:["製造業","建設業","IT","サービス業","小売・飲食"],max_emp:999,purpose:["雇用・人材"],amount:"1人1日最大8,355円",rate:"定額",deadline:"随時",status:"受付中",url:"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/pageL07.html",note:"休業・教育訓練・出向に活用。ハローワーク経由",
   guide:{steps:["最寄りのハローワーク（公共職業安定所）に相談","休業等の計画書を作成（休業実施前に提出が必要）","休業・教育訓練・出向を実施","ハローワークへ支給申請書を提出","審査・支給決定（1〜2ヶ月）","助成金の振込"],docs:["雇用調整計画書（事前提出が必要）","休業実績一覧（誰が何日休業したか）","賃金台帳（実際に支払った給与の証明）","出勤簿・タイムカード","雇用保険の加入確認書類"],agency:"ハローワーク（公共職業安定所）",caution:"休業「後」ではなく休業「前」に計画書を提出しないと対象外になる。事前提出が必須。雇用保険への加入が前提条件。"}}
];

function scoreAgri(s, p) {
  const areaOk = s.area.includes('全国') || s.area.includes(p.area) ||
    (p.area === '遊佐町' && s.area.includes('山形県'));
  if (!areaOk) return -1;
  let score = 0;
  if (s.area.includes(p.area)) score += 25;
  else if (p.area === '遊佐町' && s.area.includes('山形県')) score += 18;
  else if (s.area.includes('全国')) score += 10;
  if (s.style.includes(p.style)) score += 30;
  if (s.jouno.includes(p.jouno)) score += 20;
  for (const pt of p.purposes) { if (s.purpose.includes(pt)) score += 15; }
  if (s.status === '受付中') score += 10;
  return score;
}

function scoreBiz(s, p) {
  if (p.employees > s.max_emp) return -1;
  const areaOk = s.area.includes('全国') || s.area.includes(p.area) ||
    (p.area === '遊佐町' && s.area.includes('山形県'));
  if (!areaOk) return -1;
  let score = 0;
  if (s.area.includes(p.area)) score += 25;
  else if (p.area === '遊佐町' && s.area.includes('山形県')) score += 18;
  else if (s.area.includes('全国')) score += 10;
  if (s.type.includes(p.type)) score += 20;
  if (s.industry.includes(p.industry)) score += 25;
  for (const pt of p.purposes) { if (s.purpose.includes(pt)) score += 15; }
  if (s.status === '受付中') score += 10;
  return score;
}

function handleSearch(params) {
  const tab = params.get('tab');
  let results = [];
  if (tab === 'agri') {
    const p = {
      style: params.get('style') || '通常栽培',
      jouno: params.get('jouno') || '既存農家',
      area: params.get('area') || '全国',
      purposes: (params.get('purposes') || '').split(',').filter(Boolean)
    };
    results = AGRI.map(s => Object.assign({}, s, {score: scoreAgri(s, p)}))
      .filter(s => s.score > 0).sort((a, b) => b.score - a.score);
  } else {
    const p = {
      type: params.get('type') || '法人',
      industry: params.get('industry') || 'サービス業',
      employees: parseInt(params.get('employees') || '0'),
      area: params.get('area') || '全国',
      purposes: (params.get('purposes') || '').split(',').filter(Boolean)
    };
    results = BIZ.map(s => Object.assign({}, s, {score: scoreBiz(s, p)}))
      .filter(s => s.score > 0).sort((a, b) => b.score - a.score);
  }
  return new Response(JSON.stringify({results: results, total: results.length}), {
    headers: {'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*'}
  });
}

const HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>補助金かんたん検索ツール</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Yu Gothic UI",sans-serif;background:#f0fdf4;color:#1e293b;min-height:100vh}
.header{background:linear-gradient(180deg,#dcfce7 0%,#f0fdf4 100%);padding:28px 20px 20px;text-align:center;border-bottom:1px solid #bbf7d0}
.badge{display:inline-block;background:#15803d;color:#fff;font-size:12px;font-weight:700;padding:4px 14px;border-radius:20px;margin-bottom:10px;letter-spacing:.05em}
h1{font-size:26px;font-weight:700;color:#14532d;margin-bottom:6px}
.subtitle{font-size:14px;color:#15803d}
.container{max-width:900px;margin:0 auto;padding:24px 16px}
.tabs{display:flex;gap:8px;margin-bottom:20px}
.tab{flex:1;padding:12px;border:2px solid #bbf7d0;border-radius:10px;background:#fff;font-size:15px;font-weight:600;cursor:pointer;color:#15803d;transition:all .15s;text-align:center}
.tab.active{background:#15803d;color:#fff;border-color:#15803d}
.tab.biz-tab{color:#2563eb;border-color:#bfdbfe}
.tab.biz-tab.active{background:#2563eb;color:#fff;border-color:#2563eb}
.card{background:#fff;border-radius:14px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,.06);margin-bottom:20px}
.hint{border-left:4px solid #15803d;padding:12px 12px 12px 16px;background:#f0fdf4;border-radius:0 8px 8px 0;margin-bottom:20px;font-size:13px;color:#374151}
.hint-biz{border-color:#2563eb;background:#eff6ff}
.hint strong{display:block;font-weight:700;color:#166534;margin-bottom:2px}
.hint-biz strong{color:#1d4ed8}
.form-row{margin-bottom:16px}
.form-row>label{display:block;font-size:13px;font-weight:700;color:#166534;margin-bottom:6px}
.form-row-biz>label{color:#1d4ed8}
select{width:100%;padding:10px 36px 10px 12px;border:1.5px solid #bbf7d0;border-radius:8px;font-size:14px;color:#1e293b;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2315803d' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;appearance:none}
select.biz-select{border-color:#bfdbfe;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232563eb' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")}
.cb-group{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:8px}
.cb-group label{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:400;color:#374151;cursor:pointer;padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:8px;transition:all .1s}
.cb-group label:has(input:checked){border-color:#15803d;background:#dcfce7;color:#14532d;font-weight:600}
.cb-group.biz-cb label:has(input:checked){border-color:#2563eb;background:#eff6ff;color:#1e40af;font-weight:600}
input[type=checkbox]{accent-color:#15803d;flex-shrink:0}
.biz-cb input[type=checkbox]{accent-color:#2563eb}
.btn{width:100%;padding:14px;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;margin-top:8px;transition:background .15s;color:#fff}
.btn-agri{background:#15803d}.btn-agri:hover{background:#166534}
.btn-biz{background:#2563eb}.btn-biz:hover{background:#1d4ed8}
.result-meta{font-size:13px;color:#6b7280;margin-bottom:12px}
.tbl-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px}
th{background:#dcfce7;color:#166534;font-weight:700;padding:10px 12px;text-align:left;border-bottom:2px solid #bbf7d0;white-space:nowrap}
td{padding:10px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top}
tr.guide-row td{padding:0;background:#f8fafc;border-bottom:1px solid #e5e7eb}
tr:not(.guide-row):hover td{background:#f0fdf4}
.nm{font-weight:600;color:#14532d;min-width:160px}
.cat{display:inline-block;font-size:11px;padding:2px 8px;border-radius:20px;background:#dcfce7;color:#15803d;font-weight:600;white-space:nowrap}
.sb{display:inline-block;font-size:11px;padding:2px 8px;border-radius:20px;font-weight:700;white-space:nowrap}
.s-open{background:#dcfce7;color:#15803d}
.s-check{background:#fef3c7;color:#d97706}
.s-other{background:#f3f4f6;color:#9ca3af}
.guide-btn{display:inline-block;font-size:12px;padding:5px 12px;border-radius:6px;border:1.5px solid #15803d;color:#15803d;background:#fff;cursor:pointer;font-weight:600;white-space:nowrap;transition:all .1s}
.guide-btn:hover{background:#dcfce7}
.guide-btn.open{background:#15803d;color:#fff}
.lnk{color:#15803d;font-weight:700;text-decoration:none;font-size:12px;white-space:nowrap}
.lnk:hover{text-decoration:underline}
.guide-panel{padding:20px 24px;display:none}
.guide-panel.show{display:block}
.guide-panel h3{font-size:14px;font-weight:700;color:#166534;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #dcfce7}
.guide-steps{list-style:none;margin-bottom:16px}
.guide-steps li{display:flex;gap:10px;margin-bottom:8px;font-size:13px;color:#374151;line-height:1.5}
.step-num{flex-shrink:0;width:22px;height:22px;border-radius:50%;background:#15803d;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}
.guide-docs{margin-bottom:16px}
.guide-docs ul{list-style:none;padding-left:4px}
.guide-docs li{font-size:13px;color:#374151;padding:4px 0;padding-left:16px;position:relative}
.guide-docs li::before{content:"📄";position:absolute;left:0;font-size:11px;top:5px}
.guide-agency{font-size:12px;background:#f0fdf4;border-radius:8px;padding:10px 14px;margin-bottom:12px;color:#166534;font-weight:600}
.guide-caution{font-size:12px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;color:#92400e;line-height:1.5}
.guide-caution::before{content:"⚠️ ";font-size:13px}
.loading{text-align:center;padding:40px;color:#6b7280;font-size:15px}
.spin{display:inline-block;width:18px;height:18px;border:3px solid #dcfce7;border-top-color:#15803d;border-radius:50%;animation:spin .8s linear infinite;margin-right:8px;vertical-align:middle}
@keyframes spin{to{transform:rotate(360deg)}}
.empty{text-align:center;padding:40px;color:#9ca3af;font-size:15px}
.footer{text-align:center;font-size:11px;color:#9ca3af;padding:24px 16px;border-top:1px solid #e5e7eb;margin-top:8px}
@media(max-width:600px){h1{font-size:20px}.tabs{flex-direction:column}th,td{padding:8px}.cb-group{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<div class="header">
  <div class="badge">無料・運用コストゼロ</div>
  <h1>🌾 補助金かんたん検索ツール</h1>
  <div class="subtitle">農業・農家向け／事業者・中小企業向けの補助金を条件でリストアップ</div>
</div>
<div class="container">
  <div class="tabs" role="tablist">
    <button class="tab active" id="tab-agri" onclick="switchTab('agri')" role="tab">🌾 農業・農家向け</button>
    <button class="tab biz-tab" id="tab-biz" onclick="switchTab('biz')" role="tab">🏢 事業者・中小企業向け</button>
  </div>

  <div id="panel-agri" class="card">
    <div class="hint"><strong>検索のしかた</strong>農業スタイルや就農状況を選び、やりたいことにチェックを入れて「検索する」を押してください。</div>
    <div class="form-row">
      <label>農業スタイル</label>
      <select id="farming_style">
        <option value="通常栽培">通常栽培（慣行農業）</option>
        <option value="有機・自然栽培">有機・自然栽培</option>
        <option value="施設栽培">施設栽培（ハウス等）</option>
      </select>
    </div>
    <div class="form-row">
      <label>就農状況</label>
      <select id="jouno_status">
        <option value="既存農家">すでに農業をしている</option>
        <option value="新規就農">新規就農（5年以内）</option>
        <option value="就農前">これから就農予定</option>
      </select>
    </div>
    <div class="form-row">
      <label>農地・お住まいの場所</label>
      <select id="area_agri">
        <option value="遊佐町">山形県 遊佐町</option>
        <option value="山形県">山形県（遊佐町以外）</option>
        <option value="東北">東北地方（山形県以外）</option>
        <option value="全国">全国（その他）</option>
      </select>
    </div>
    <div class="form-row">
      <label>やりたいこと（複数選択OK）</label>
      <div class="cb-group" id="agri-cb">
        <label><input type="checkbox" value="農機購入"> 農機・機械の購入</label>
        <label><input type="checkbox" value="施設整備"> 施設・ハウスの整備</label>
        <label><input type="checkbox" value="有機転換"> 有機・自然栽培への転換</label>
        <label><input type="checkbox" value="販路拡大"> 販路拡大・6次産業化</label>
        <label><input type="checkbox" value="IT化"> IT化・スマート農業</label>
        <label><input type="checkbox" value="就農支援"> 就農支援・生活費</label>
      </div>
    </div>
    <button class="btn btn-agri" onclick="doSearch('agri')">🔍 補助金を検索する</button>
  </div>

  <div id="panel-biz" class="card" style="display:none">
    <div class="hint hint-biz"><strong>検索のしかた</strong>事業形態・業種・従業員数を選び、やりたいことにチェックを入れて「検索する」を押してください。</div>
    <div class="form-row form-row-biz">
      <label>事業形態</label>
      <select id="target_type" class="biz-select">
        <option value="個人事業主">個人事業主・フリーランス</option>
        <option value="法人">法人（株式・合同・有限等）</option>
      </select>
    </div>
    <div class="form-row form-row-biz">
      <label>業種</label>
      <select id="industry" class="biz-select">
        <option value="製造業">製造業</option>
        <option value="建設業">建設業</option>
        <option value="小売・飲食">小売業・飲食業</option>
        <option value="IT">IT・情報通信業</option>
        <option value="サービス業">サービス業</option>
      </select>
    </div>
    <div class="form-row form-row-biz">
      <label>従業員数</label>
      <select id="employees" class="biz-select">
        <option value="0">0人（個人・一人経営）</option>
        <option value="5">1〜5人</option>
        <option value="20">6〜20人</option>
        <option value="50">21〜50人</option>
        <option value="300">51〜300人</option>
        <option value="999">301人以上</option>
      </select>
    </div>
    <div class="form-row form-row-biz">
      <label>事業所・お住まいの場所</label>
      <select id="area_biz" class="biz-select">
        <option value="遊佐町">山形県 遊佐町</option>
        <option value="山形県">山形県（遊佐町以外）</option>
        <option value="全国">全国（その他）</option>
      </select>
    </div>
    <div class="form-row form-row-biz">
      <label>やりたいこと（複数選択OK）</label>
      <div class="cb-group biz-cb" id="biz-cb">
        <label><input type="checkbox" value="設備投資"> 設備・機械の購入</label>
        <label><input type="checkbox" value="IT導入"> ITシステム導入</label>
        <label><input type="checkbox" value="販路拡大"> 販路拡大・EC展開</label>
        <label><input type="checkbox" value="省エネ"> 省エネ設備の導入</label>
        <label><input type="checkbox" value="創業"> 創業・起業</label>
        <label><input type="checkbox" value="業態転換"> 業態転換・再構築</label>
        <label><input type="checkbox" value="雇用・人材"> 採用・人材育成</label>
      </div>
    </div>
    <button class="btn btn-biz" onclick="doSearch('biz')">🔍 補助金を検索する</button>
  </div>

  <div id="results" style="display:none">
    <div class="result-meta" id="result-meta"></div>
    <div class="card" style="padding:0;overflow:hidden">
      <div id="result-body"></div>
    </div>
  </div>
</div>
<div class="footer">本ツールは補助金情報の検索支援ツールです。申請可否・最新情報は必ず各公式サイトでご確認ください。情報は定期的に更新しています。</div>

<script>
var guideData = {};

function switchTab(tab) {
  document.getElementById('tab-agri').classList.toggle('active', tab === 'agri');
  document.getElementById('tab-biz').classList.toggle('active', tab === 'biz');
  document.getElementById('panel-agri').style.display = tab === 'agri' ? '' : 'none';
  document.getElementById('panel-biz').style.display = tab === 'biz' ? '' : 'none';
  document.getElementById('results').style.display = 'none';
}

function getCb(id) {
  return Array.from(document.querySelectorAll('#' + id + ' input:checked')).map(function(el){ return el.value; }).join(',');
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function safeUrl(url) {
  if (typeof url !== 'string') return '#';
  return /^https?:\\/\\//.test(url) ? esc(url) : '#';
}

function sbadge(s) {
  if (s === '受付中') return '<span class="sb s-open">受付中</span>';
  if (s === '要確認') return '<span class="sb s-check">要確認</span>';
  return '<span class="sb s-other">' + esc(s) + '</span>';
}

function toggleGuide(id) {
  var btn = document.getElementById('gbtn-' + id);
  var panel = document.getElementById('gpanel-' + id);
  var isOpen = panel.classList.contains('show');
  if (isOpen) {
    panel.classList.remove('show');
    btn.classList.remove('open');
    btn.textContent = '📋 申請手順を見る ▼';
  } else {
    if (!panel.innerHTML.trim() && guideData[id]) {
      panel.innerHTML = buildGuide(guideData[id]);
    }
    panel.classList.add('show');
    btn.classList.add('open');
    btn.textContent = '📋 申請手順を閉じる ▲';
  }
}

function buildGuide(g) {
  var steps = '';
  for (var i = 0; i < g.steps.length; i++) {
    steps += '<li><span class="step-num">' + (i+1) + '</span><span>' + esc(g.steps[i]) + '</span></li>';
  }
  var docs = '';
  for (var j = 0; j < g.docs.length; j++) {
    docs += '<li>' + esc(g.docs[j]) + '</li>';
  }
  return '<h3>📋 申請の流れ</h3>'
    + '<ol class="guide-steps">' + steps + '</ol>'
    + '<h3>📄 必要書類</h3>'
    + '<div class="guide-docs"><ul>' + docs + '</ul></div>'
    + '<div class="guide-agency">🏢 申請窓口：' + esc(g.agency) + '</div>'
    + '<div class="guide-caution">' + esc(g.caution) + '</div>';
}

async function doSearch(tab) {
  guideData = {};
  document.getElementById('results').style.display = '';
  document.getElementById('result-body').innerHTML = '<div class="loading"><span class="spin"></span>検索中...</div>';
  document.getElementById('result-meta').textContent = '';
  var url;
  if (tab === 'agri') {
    url = '/api/search?tab=agri'
      + '&style=' + encodeURIComponent(document.getElementById('farming_style').value)
      + '&jouno=' + encodeURIComponent(document.getElementById('jouno_status').value)
      + '&area=' + encodeURIComponent(document.getElementById('area_agri').value)
      + '&purposes=' + encodeURIComponent(getCb('agri-cb'));
  } else {
    url = '/api/search?tab=biz'
      + '&type=' + encodeURIComponent(document.getElementById('target_type').value)
      + '&industry=' + encodeURIComponent(document.getElementById('industry').value)
      + '&employees=' + encodeURIComponent(document.getElementById('employees').value)
      + '&area=' + encodeURIComponent(document.getElementById('area_biz').value)
      + '&purposes=' + encodeURIComponent(getCb('biz-cb'));
  }
  try {
    var res = await fetch(url);
    var data = await res.json();
    renderResults(data.results);
  } catch(e) {
    document.getElementById('result-body').textContent = '';
    var err = document.createElement('div');
    err.className = 'empty';
    err.textContent = '⚠️ 読み込みエラーが発生しました';
    document.getElementById('result-body').appendChild(err);
  }
}

function renderResults(results) {
  var meta = document.getElementById('result-meta');
  var body = document.getElementById('result-body');
  meta.textContent = '';
  if (!results || results.length === 0) {
    var empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = '📭 条件に合う補助金が見つかりませんでした。条件を変更してお試しください。';
    body.textContent = '';
    body.appendChild(empty);
    return;
  }
  var strong = document.createElement('strong');
  strong.textContent = results.length + '件';
  meta.appendChild(strong);
  meta.appendChild(document.createTextNode('ヒットしました（マッチ度が高い順）。各行の「申請手順を見る」で手続きの流れを確認できます。'));

  for (var i = 0; i < results.length; i++) {
    if (results[i].guide) guideData[results[i].id] = results[i].guide;
  }

  var rows = '';
  for (var i = 0; i < results.length; i++) {
    var r = results[i];
    var hasGuide = r.guide ? true : false;
    rows += '<tr>'
      + '<td class="nm">' + esc(r.name) + '</td>'
      + '<td><span class="cat">' + esc(r.category) + '</span></td>'
      + '<td style="white-space:nowrap;font-size:12px">' + esc((r.area || []).join('・')) + '</td>'
      + '<td style="white-space:nowrap">' + esc(r.amount) + '</td>'
      + '<td style="white-space:nowrap">' + esc(r.rate) + '</td>'
      + '<td style="white-space:nowrap;font-size:12px">' + esc(r.deadline) + '</td>'
      + '<td>' + sbadge(r.status) + '</td>'
      + '<td><a href="' + safeUrl(r.url) + '" target="_blank" rel="noopener" class="lnk">公式を見る →</a></td>'
      + (hasGuide ? '<td><button class="guide-btn" id="gbtn-' + esc(r.id) + '" data-id="' + esc(r.id) + '" onclick="toggleGuide(this.dataset.id)">📋 申請手順を見る ▼</button></td>' : '<td></td>')
      + '</tr>'
      + (hasGuide ? '<tr class="guide-row"><td colspan="9"><div class="guide-panel" id="gpanel-' + esc(r.id) + '"></div></td></tr>' : '');
  }

  body.innerHTML = '<div class="tbl-wrap"><table>'
    + '<thead><tr><th>補助金名</th><th>カテゴリ</th><th>エリア</th><th>補助上限</th><th>補助率</th><th>期限</th><th>状態</th><th>公式</th><th>申請ガイド</th></tr></thead>'
    + '<tbody>' + rows + '</tbody></table></div>';
}
</script>
</body>
</html>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/api/search') {
      return handleSearch(url.searchParams);
    }
    return new Response(HTML, {
      headers: {'Content-Type': 'text/html; charset=utf-8'}
    });
  }
};
