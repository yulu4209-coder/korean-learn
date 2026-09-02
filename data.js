/* Korean-learn 课程数据
 * kind: letters = 字母单元, rules = 音变规则单元, phrases = 词句单元
 * threshold: 模块考核及格线（正确率百分比），基础模块最高，越往后越宽松
 */

const MODULE_LETTERS = {
  id: 1,
  title: "四十音",
  desc: "元音、辅音与拼读的地基",
  kind: "letters",
  threshold: 80,
  lessons: [
    {
      title: "基本元音",
      sub: "기본 모음",
      intro: "韩文的音节由「初声 + 中声（+ 终声）」拼成，中声一定是元音。先掌握这 8 个基本元音，就能拼出大量音节。",
      items: [
        { ch: "ㅏ", syl: "아", roman: "a", tip: "嘴自然张开，舌头放平，接近中文「啊」。", ex: { ko: "아이", roman: "ai", zh: "孩子" } },
        { ch: "ㅓ", syl: "어", roman: "eo", tip: "嘴张小一些，舌位靠后，像「哦」但嘴更扁。", ex: { ko: "어머니", roman: "eomeoni", zh: "母亲" } },
        { ch: "ㅗ", syl: "오", roman: "o", tip: "双唇收圆向前突出，像「哦」。", ex: { ko: "오이", roman: "oi", zh: "黄瓜" } },
        { ch: "ㅜ", syl: "우", roman: "u", tip: "双唇收得更圆更小，像「呜」。", ex: { ko: "우유", roman: "uyu", zh: "牛奶" } },
        { ch: "ㅡ", syl: "으", roman: "eu", tip: "嘴角向两侧拉开，舌面放平，类似「资」的韵母。", ex: { ko: "음식", roman: "eumsik", zh: "食物" } },
        { ch: "ㅣ", syl: "이", roman: "i", tip: "嘴角向两侧拉开，像「衣」。", ex: { ko: "이름", roman: "ireum", zh: "名字" } },
        { ch: "ㅐ", syl: "애", roman: "ae", tip: "开口比 ㅏ 小、比 ㅔ 大，介于两者之间。", ex: { ko: "배", roman: "bae", zh: "梨" } },
        { ch: "ㅔ", syl: "에", roman: "e", tip: "开口比 ㅐ 更小，接近「诶」。", ex: { ko: "네", roman: "ne", zh: "是，好" } }
      ]
    },
    {
      title: "y 行元音",
      sub: "y 계열 모음",
      intro: "在基本元音前加一个短促的 [y] 音，写法上就是多加一横或一竖。发音时先滑过「衣」再落到主元音。",
      items: [
        { ch: "ㅑ", syl: "야", roman: "ya", tip: "ㅣ + ㅏ，先「衣」后「啊」。", ex: { ko: "야구", roman: "yagu", zh: "棒球" } },
        { ch: "ㅕ", syl: "여", roman: "yeo", tip: "ㅣ + ㅓ，是初学最容易和 ㅛ 混的一个。", ex: { ko: "여기", roman: "yeogi", zh: "这里" } },
        { ch: "ㅛ", syl: "요", roman: "yo", tip: "ㅣ + ㅗ，先「衣」后「哦」。", ex: { ko: "요리", roman: "yori", zh: "料理，做菜" } },
        { ch: "ㅠ", syl: "유", roman: "yu", tip: "ㅣ + ㅜ，先「衣」后「呜」。", ex: { ko: "유리", roman: "yuri", zh: "玻璃" } },
        { ch: "ㅒ", syl: "얘", roman: "yae", tip: "ㅣ + ㅐ，日常出现频率很低。", ex: { ko: "얘", roman: "yae", zh: "这孩子（口语）" } },
        { ch: "ㅖ", syl: "예", roman: "ye", tip: "ㅣ + ㅔ，现代口语中常与 ㅔ 同音。", ex: { ko: "예약", roman: "yeyak", zh: "预约" } }
      ]
    },
    {
      title: "w 行元音",
      sub: "w 계열 모음",
      intro: "由两个元音复合而成的双元音，发音时从一个元音滑向另一个，听起来带 [w] 的过渡。",
      items: [
        { ch: "ㅘ", syl: "와", roman: "wa", tip: "ㅗ + ㅏ，先「哦」后「啊」。", ex: { ko: "와이파이", roman: "waipai", zh: "无线网络" } },
        { ch: "ㅙ", syl: "왜", roman: "wae", tip: "ㅗ + ㅐ，与 ㅞ 在现代口语中几乎同音。", ex: { ko: "왜", roman: "wae", zh: "为什么" } },
        { ch: "ㅝ", syl: "워", roman: "wo", tip: "ㅜ + ㅓ，先「呜」后「哦」。", ex: { ko: "원", roman: "won", zh: "韩元，圆" } },
        { ch: "ㅞ", syl: "웨", roman: "we", tip: "ㅜ + ㅔ，多出现在外来词中。", ex: { ko: "웨이터", roman: "weiteo", zh: "服务员" } },
        { ch: "ㅟ", syl: "위", roman: "wi", tip: "ㅜ + ㅣ，先「呜」后「衣」。", ex: { ko: "위", roman: "wi", zh: "上面" } },
        { ch: "ㅚ", syl: "외", roman: "oe", tip: "ㅗ + ㅣ，现代多读成接近 [we]。", ex: { ko: "외국", roman: "oeguk", zh: "外国" } },
        { ch: "ㅢ", syl: "의", roman: "ui", tip: "ㅡ + ㅣ，词首发「의」，词中或助词中常读 [이]。", ex: { ko: "의자", roman: "uija", zh: "椅子" } }
      ]
    },
    {
      title: "松音（平音）",
      sub: "예사소리",
      intro: "松音是不送气的轻音，发在「完全不送气」和「明显送气」之间。中文母语者常觉得它既像 g 又像 k，这是正常的。",
      items: [
        { ch: "ㄱ", syl: "가", roman: "g / k", tip: "舌根抵住软腭后放开，介于「g」和「k」之间。", ex: { ko: "가방", roman: "gabang", zh: "包" } },
        { ch: "ㄷ", syl: "다", roman: "d / t", tip: "舌尖抵住上齿龈后放开，介于「d」和「t」之间。", ex: { ko: "다", roman: "da", zh: "都，全部" } },
        { ch: "ㅂ", syl: "바", roman: "b / p", tip: "双唇闭合后放开，介于「b」和「p」之间。", ex: { ko: "바다", roman: "bada", zh: "海" } },
        { ch: "ㅅ", syl: "사", roman: "s", tip: "舌尖靠近上齿龈留出窄缝，气流摩擦而出。", ex: { ko: "사과", roman: "sagwa", zh: "苹果；道歉" } },
        { ch: "ㅈ", syl: "자", roman: "j", tip: "舌面贴住上颚后放开，比「鸡」的声母更轻。", ex: { ko: "자다", roman: "jada", zh: "睡觉" } }
      ]
    },
    {
      title: "紧音",
      sub: "된소리",
      intro: "紧音是松音的「加倍版」：写法上把字母写两遍，发音时喉部先收紧再放开，气流短促有力、完全不送气。",
      items: [
        { ch: "ㄲ", syl: "까", roman: "kk", tip: "ㄱ 的紧音，喉部收紧后爆破。", ex: { ko: "아까", roman: "akka", zh: "刚才" } },
        { ch: "ㄸ", syl: "따", roman: "tt", tip: "ㄷ 的紧音，舌尖用力抵住再放开。", ex: { ko: "떡", roman: "tteok", zh: "年糕" } },
        { ch: "ㅃ", syl: "빠", roman: "pp", tip: "ㅂ 的紧音，双唇紧闭后猛地放开。", ex: { ko: "빵", roman: "ppang", zh: "面包" } },
        { ch: "ㅆ", syl: "싸", roman: "ss", tip: "ㅅ 的紧音，摩擦感更强；作收音时读 [t]。", ex: { ko: "싸다", roman: "ssada", zh: "便宜" } },
        { ch: "ㅉ", syl: "짜", roman: "jj", tip: "ㅈ 的紧音，舌面用力贴住上颚。", ex: { ko: "짜다", roman: "jjada", zh: "咸；拧" } }
      ]
    },
    {
      title: "送气音",
      sub: "거센소리",
      intro: "送气音是在松音基础上明显送气，气流强到能吹动手心前的纸片。这是区分「불(火)」和「풀(胶水)」的关键。",
      items: [
        { ch: "ㅋ", syl: "카", roman: "k", tip: "ㄱ 加一横，送气明显增强。", ex: { ko: "카드", roman: "kadeu", zh: "卡片" } },
        { ch: "ㅌ", syl: "타", roman: "t", tip: "ㄷ 加一横，送气明显增强。", ex: { ko: "택시", roman: "taeksi", zh: "出租车" } },
        { ch: "ㅍ", syl: "파", roman: "p", tip: "ㅂ 加两竖，双唇放开时用力送气。", ex: { ko: "파티", roman: "pati", zh: "派对" } },
        { ch: "ㅊ", syl: "차", roman: "ch", tip: "ㅈ 加一短横，送气明显增强。", ex: { ko: "차", roman: "cha", zh: "茶；车" } },
        { ch: "ㅎ", syl: "하", roman: "h", tip: "气流从喉咙直接摩擦而出，像轻轻的「哈」。", ex: { ko: "한국", roman: "hanguk", zh: "韩国" } }
      ]
    },
    {
      title: "响音（无归属）",
      sub: "울림소리",
      intro: "这四个不属于松音、紧音、送气音任何一组，气流都从鼻腔或舌侧通过，声音响亮，所以叫响音。其中 ㅇ 在词首不发音，只用来占位。",
      items: [
        { ch: "ㄴ", syl: "나", roman: "n", tip: "舌尖抵住上齿龈，气流从鼻腔出来。", ex: { ko: "나", roman: "na", zh: "我（平语）" } },
        { ch: "ㅁ", syl: "마", roman: "m", tip: "双唇闭合，气流从鼻腔出来。", ex: { ko: "마시다", roman: "masida", zh: "喝" } },
        { ch: "ㅇ", syl: "아", roman: "ng / 不发音", tip: "在词首只占位、不发音；作收音时读后鼻音 [ng]。", ex: { ko: "아이", roman: "ai", zh: "孩子" } },
        { ch: "ㄹ", syl: "라", roman: "r / l", tip: "舌尖轻弹上齿龈；在词首接近 [r]，作收音时读 [l]。", ex: { ko: "라디오", roman: "radio", zh: "收音机" } }
      ]
    }
  ]
};

const MODULE_RULES = {
  id: 2,
  title: "收音与音变",
  desc: "韩语真正听起来像韩语的地方",
  kind: "rules",
  threshold: 76,
  lessons: [
    {
      title: "收音代表音",
      sub: "받침의 대표음",
      intro: "收音（받침）是音节底部的辅音。写法上有 27 种，但实际只发 7 种音：ㄱ[k] ㄴ[n] ㄷ[t] ㄹ[l] ㅁ[m] ㅂ[p] ㅇ[ng]。",
      items: [
        { ko: "한국", real: "한굴", roman: "han-guk", zh: "韩国", tip: "ㄱ 收音：舌根抵住软腭，气流不放出来。" },
        { ko: "돈", real: "돈", roman: "don", zh: "钱", tip: "ㄴ 收音：舌尖抵住上齿龈，声音从鼻腔走。" },
        { ko: "곧", real: "곧", roman: "got", zh: "马上", tip: "ㄷ 收音：舌尖抵住上齿龈后收住不放。" },
        { ko: "물", real: "물", roman: "mul", zh: "水", tip: "ㄹ 收音：舌尖翘起抵住上齿龈，像英语词尾的 l。" },
        { ko: "이름", real: "이름", roman: "ireum", zh: "名字", tip: "ㅁ 收音：双唇闭合，声音从鼻腔走。" },
        { ko: "밥", real: "밥", roman: "bap", zh: "饭", tip: "ㅂ 收音：双唇闭合后收住不放。" },
        { ko: "공", real: "공", roman: "gong", zh: "球；零", tip: "ㅇ 收音：舌根抬起，发后鼻音 [ng]。" }
      ]
    },
    {
      title: "双收音与特殊收音",
      sub: "겹받침",
      intro: "两个辅音挤在一个收音位置时，通常只读其中一个；但如果后面接元音，另一个就会被带到下一个音节去（连读）。",
      items: [
        { ko: "있다", real: "읻따", roman: "itda", zh: "有，在", tip: "ㅆ 收音单读时发 [t]，后面接元音时才读 [ss]。" },
        { ko: "닭", real: "닥", roman: "dak", zh: "鸡", tip: "ㄺ 单读时只读右边的 ㄱ；后接元音时读 [ㄹg]，닭이 → 달기。" },
        { ko: "괜찮다", real: "괜찬타", roman: "gwaenchanta", zh: "没关系", tip: "ㅀ 单读时读 [l]；后接元音时 ㅎ 脱落。" },
        { ko: "없다", real: "업따", roman: "eopda", zh: "没有", tip: "ㅄ 只读左边的 ㅂ；后接元音时读 [ㅂs]，없어 → 업서。" },
        { ko: "앉다", real: "안따", roman: "antda", zh: "坐", tip: "ㄵ 单读时读 [n]；后接元音时读 [ㄴj]，앉아 → 안자。" },
        { ko: "많다", real: "만타", roman: "manta", zh: "多", tip: "ㄶ 单读时读 [n]；后接元音时读 [ㄴh]，많아 → 마나。" },
        { ko: "젊다", real: "점따", roman: "jeomda", zh: "年轻", tip: "ㄻ 单读时读 [m]；后接元音时读 [ㄹm]。" },
        { ko: "밖", real: "박", roman: "bak", zh: "外面", tip: "ㄲ 收音按紧音读，但收音位置不能送气，仍读作 [k]。" }
      ]
    },
    {
      title: "连读",
      sub: "연음",
      intro: "收音后面遇到以 ㅇ 开头的音节时，收音会「搬家」到下一个音节开头去读。这是韩语听起来连贯的根本原因。",
      rule: "收音 + ㅇ 开头的音节 → 收音移到下一音节开头",
      items: [
        { ko: "한국어", real: "한구거", roman: "hangugeo", zh: "韩语", tip: "국 的 ㄱ 移到 어 前面，变成 구。" },
        { ko: "괜찮아요", real: "괜차나요", roman: "gwaenchanayo", zh: "没关系", tip: "ㅎ 脱落，ㄴ 移到 아 前面。" },
        { ko: "밥을", real: "바블", roman: "babeul", zh: "饭（宾格）", tip: "ㅂ 移到 을 前面，变成 버。" },
        { ko: "옷이", real: "오시", roman: "osi", zh: "衣服（主格）", tip: "ㅆ 移到 이 前面，读成 [s] 而不是 [t]。" }
      ]
    },
    {
      title: "紧音化",
      sub: "된소리되기",
      intro: "当 ㄱ·ㄷ·ㅂ 收音后面遇到 ㄱ·ㄷ·ㅂ·ㅅ·ㅈ 开头的音节时，后一个音会变紧。听到韩语里突然变重的音，多半就是这个规则。",
      rule: "ㄱ·ㄷ·ㅂ 收音 + ㄱ·ㄷ·ㅂ·ㅅ·ㅈ → 后一个音变紧音",
      items: [
        { ko: "국밥", real: "국빱", roman: "gukppap", zh: "汤饭", tip: "국 的 ㄱ 让后面的 ㅂ 变成 ㅃ。" },
        { ko: "식당", real: "식땅", roman: "sikttang", zh: "食堂", tip: "식 的 ㄱ 让后面的 ㄷ 变成 ㄸ。" },
        { ko: "학생", real: "학쌩", roman: "haksaeng", zh: "学生", tip: "학 的 ㄱ 让后面的 ㅅ 变成 ㅆ。" },
        { ko: "듣다", real: "듣따", roman: "deutda", zh: "听", tip: "듣 的 ㄷ 让后面的 ㄷ 变成 ㄸ。" }
      ]
    },
    {
      title: "鼻音化",
      sub: "비음화",
      intro: "ㄱ·ㄷ·ㅂ 这三个「塞音」收音，遇到 ㄴ·ㅁ 这两个鼻音时会被同化，自己也变成鼻音：ㄱ→ㅇ，ㄷ→ㄴ，ㅂ→ㅁ。",
      rule: "ㄱ·ㄷ·ㅂ + ㄴ·ㅁ → ㅇ·ㄴ·ㅁ",
      items: [
        { ko: "국물", real: "궁물", roman: "gungmul", zh: "汤", tip: "ㄱ 遇到 ㅁ 变成 ㅇ。" },
        { ko: "한국말", real: "한궁말", roman: "hangungmal", zh: "韩语（话）", tip: "ㄱ 遇到 ㅁ 变成 ㅇ，所以听起来像「한궁말」。" },
        { ko: "독립", real: "동닙", roman: "dongnip", zh: "独立", tip: "ㄱ 遇到 ㄴ 变成 ㅇ；后面的 ㄹ 遇到 ㄴ 也读成 ㄴ。" },
        { ko: "십 년", real: "심 년", roman: "sim nyeon", zh: "十年", tip: "ㅂ 遇到 ㄴ 变成 ㅁ。" }
      ]
    },
    {
      title: "流音化与腭化",
      sub: "유음화 · 구개음화",
      intro: "两条让韩语听起来「滑溜溜」的规则：ㄴ 遇到 ㄹ 会被同化成 ㄹ；ㄷ·ㅌ 收音遇到 이 会被上颚同化成 ㅈ·ㅊ。",
      rule: "ㄴ + ㄹ → ㄹ + ㄹ；ㄷ·ㅌ + 이 → 지·치",
      items: [
        { ko: "신라", real: "실라", roman: "silla", zh: "新罗", tip: "ㄴ 被后面的 ㄹ 同化，变成 ㄹ。" },
        { ko: "칼날", real: "칼랄", roman: "kallal", zh: "刀刃", tip: "前面的 ㄹ 让后面的 ㄴ 也变成 ㄹ。" },
        { ko: "같이", real: "가치", roman: "gachi", zh: "一起", tip: "ㅌ 收音遇到 이，读成 치。" },
        { ko: "굳이", real: "구지", roman: "guji", zh: "硬要，非要", tip: "ㄷ 收音遇到 이，读成 지。" },
        { ko: "해돋이", real: "해도지", roman: "haedoji", zh: "日出", tip: "ㄷ 后面接 이，同样读成 지。" }
      ]
    },
    {
      title: "ㅎ 脱落与送气音化",
      sub: "ㅎ 탈락 · 격음화",
      intro: "ㅎ 是韩语里最「虚弱」的音：遇到元音常常直接消失，遇到 ㄱ·ㄷ·ㅈ 则会把对方推成送气音。",
      rule: "ㅎ + 元音 → 脱落；ㅎ + ㄱ·ㄷ·ㅈ → ㅋ·ㅌ·ㅊ",
      items: [
        { ko: "좋아요", real: "조아요", roman: "joayo", zh: "喜欢", tip: "ㅎ 遇到 아 直接脱落。" },
        { ko: "많이", real: "마니", roman: "mani", zh: "很多", tip: "ㅎ 遇到 이 脱落，所以听起来像「마니」。" },
        { ko: "좋다", real: "조타", roman: "jota", zh: "好", tip: "ㅎ 遇到 ㄷ，把 ㄷ 推成 ㅌ。" },
        { ko: "축하", real: "추카", roman: "chuka", zh: "祝贺", tip: "ㅎ 遇到 ㄱ，把 ㄱ 推成 ㅋ。" },
        { ko: "놓지", real: "노치", roman: "nochi", zh: "放下（否定词干）", tip: "ㅎ 遇到 ㅈ，把 ㅈ 推成 ㅊ。" }
      ]
    }
  ]
};

const MODULE_PHRASES = [
  {
    id: 3,
    title: "问候与礼貌",
    desc: "开口第一句与得体回话",
    kind: "phrases",
    threshold: 72,
    lessons: [
      {
        title: "初次见面",
        intro: "韩语的敬语靠词尾体现。下面几句都是最安全的敬语形式，对陌生人也能直接用。",
        items: [
          { ko: "안녕하세요", roman: "annyeonghaseyo", zh: "您好，你好", note: "词首的 ㅇ 不发音，直接读「안녕」；하세요 里的 ㅂ 是装饰，不发音。", ex: { ko: "안녕하세요, 반갑습니다.", roman: "annyeonghaseyo, bangapseumnida", zh: "您好，很高兴见到您。" } },
          { ko: "반갑습니다", roman: "bangapseumnida", zh: "很高兴见到您", note: "ㅂ 收音在 ㅅ 前读成 [p]，所以是「반갑씀니다」。", ex: { ko: "만나서 반갑습니다.", roman: "mannaseo bangapseumnida", zh: "见到您很高兴。" } },
          { ko: "저는", roman: "jeoneun", zh: "我（谦称）", note: "는 是主题助词，用来提示「谁/什么」。", ex: { ko: "저는 학생이에요.", roman: "jeoneun haksaeng-ieyo", zh: "我是学生。" } },
          { ko: "이름", roman: "ireum", zh: "名字", note: "름 的 ㅁ 收音要闭住嘴唇再收。", ex: { ko: "이름이 뭐예요?", roman: "ireum-i mwoyeyo", zh: "您叫什么名字？" } },
          { ko: "잘 부탁합니다", roman: "jal butakamnida", zh: "请多关照", note: "初次见面必配的一句，字面是「请好好拜托了」。", ex: { ko: "처음 뵙겠습니다. 잘 부탁합니다.", roman: "cheoeum boepgesseumnida", zh: "初次见面，请多关照。" } },
          { ko: "네, 아니요", roman: "ne, aniyo", zh: "是，不是", note: "네 的发音介于「ne」和「de」之间，不要读成「内」。", ex: { ko: "네, 맞아요.", roman: "ne, majayo", zh: "是的，没错。" } }
        ]
      },
      {
        title: "感谢与道歉",
        intro: "谢谢有两套常用说法：감사합니다 偏正式，고맙습니다 更口语。道歉时配合轻微点头更自然。",
        items: [
          { ko: "감사합니다", roman: "gamsahamnida", zh: "谢谢", note: "ㅂ 收音在 ㄴ 前变成 ㅁ，听感接近「감삼니다」。", ex: { ko: "도와주셔서 감사합니다.", roman: "dowajusyeoseo gamsahamnida", zh: "谢谢您的帮助。" } },
          { ko: "고맙습니다", roman: "gomapseumnida", zh: "谢谢（口语）", note: "同样发生鼻音化，读成「고맙씀니다」。", ex: { ko: "정말 고맙습니다.", roman: "jeongmal gomapseumnida", zh: "真的谢谢你。" } },
          { ko: "죄송합니다", roman: "joesonghamnida", zh: "对不起", note: "ㅚ 现代首尔口音常读成接近 [we]。", ex: { ko: "늦어서 죄송합니다.", roman: "neujeoseo joesonghamnida", zh: "抱歉我迟到了。" } },
          { ko: "괜찮아요", roman: "gwaenchanayo", zh: "没关系，可以", note: "ㅀ 收音的 ㅎ 脱落，读成「괜차나요」。", ex: { ko: "괜찮아요, 천천히 하세요.", roman: "gwaenchanayo, cheoncheonhi haseyo", zh: "没关系，慢慢来。" } },
          { ko: "안녕히 가세요", roman: "annyeonghi gaseyo", zh: "再见（对方要离开）", note: "对要走的人说；ㅎ 在连读中很轻。", ex: { ko: "안녕히 가세요, 또 만나요.", roman: "annyeonghi gaseyo, tto mannayo", zh: "再见，下次见。" } },
          { ko: "안녕히 계세요", roman: "annyeonghi gyeseyo", zh: "再见（自己离开）", note: "自己要走时用；계 读 gye。", ex: { ko: "저 먼저 갈게요. 안녕히 계세요.", roman: "jeo meonjeo galgeyo", zh: "我先走了，再见。" } }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "认识彼此",
    desc: "自我介绍与简单问答",
    kind: "phrases",
    threshold: 68,
    lessons: [
      {
        title: "介绍自己",
        intro: "韩语的语序是「主语 + 宾语 + 谓语」，动词永远在最后。先记住几个高频句式，换词就能说很多句。",
        items: [
          { ko: "중국에서 왔어요", roman: "junggugeseo wasseoyo", zh: "我从中国来", note: "국 的 ㄱ 遇到 에 连读，读成 [중구게서]。", ex: { ko: "저는 중국에서 왔어요.", roman: "jeoneun junggugeseo wasseoyo", zh: "我来自中国。" } },
          { ko: "학생이에요", roman: "haksaeng-ieyo", zh: "我是学生", note: "학생 发生紧音化，读成「학쌩」。", ex: { ko: "저는 학생이에요.", roman: "jeoneun haksaeng-ieyo", zh: "我是学生。" } },
          { ko: "한국어를 배워요", roman: "hangugeo-reul baewoyo", zh: "我学韩语", note: "를 是宾格助词，标记动作的承受对象。", ex: { ko: "저는 한국어를 배워요.", roman: "jeoneun hangugeo-reul baewoyo", zh: "我在学韩语。" } },
          { ko: "취미는", roman: "chwimineun", zh: "兴趣是", note: "는 提示主题，后面接兴趣名词即可。", ex: { ko: "제 취미는 음악이에요.", roman: "je chwimineun eumag-ieyo", zh: "我的兴趣是音乐。" } },
          { ko: "조금만 할 수 있어요", roman: "jogeumman hal su isseoyo", zh: "只会一点点", note: "自我谦称，被夸奖时用来接话很自然。", ex: { ko: "한국어를 조금만 할 수 있어요.", roman: "hangugeo-reul jogeumman hal su isseoyo", zh: "我只会一点点韩语。" } }
        ]
      },
      {
        title: "简单问答",
        intro: "疑问句只要在句尾把语调抬起来就行，语序和陈述句完全一样。",
        items: [
          { ko: "어디에서 왔어요?", roman: "eodieseo wasseoyo", zh: "您从哪里来？", note: "왔어요 的 ㅆ 收音在词中读紧音。", ex: { ko: "어디에서 왔어요?", roman: "eodieseo wasseoyo", zh: "您是从哪里来的？" } },
          { ko: "이름이 뭐예요?", roman: "ireum-i mwoyeyo", zh: "您叫什么名字？", note: "뭐 是 무엇 的口语缩略。", ex: { ko: "실례지만 이름이 뭐예요?", roman: "sillyejiman ireum-i mwoyeyo", zh: "冒昧问一下，您叫什么？" } },
          { ko: "몇 살이에요?", roman: "myeot sar-ieyo", zh: "您几岁？", note: "몇 的 ㅊ 收音遇到 사 时读 [t]，口语常连读。", ex: { ko: "올해 몇 살이에요?", roman: "olhae myeot sar-ieyo", zh: "您今年多大？" } },
          { ko: "어디 살아요?", roman: "eodi sarayo", zh: "您住在哪儿？", note: "살아요 连读，ㄹ 移到 아 前面。", ex: { ko: "지금 어디 살아요?", roman: "jigeum eodi sarayo", zh: "您现在住在哪儿？" } },
          { ko: "잘 지내요", roman: "jal jinaeyo", zh: "过得挺好的", note: "问候常用，答句也用它。", ex: { ko: "네, 잘 지내요.", roman: "ne, jal jinaeyo", zh: "嗯，过得挺好的。" } }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "吃喝点餐",
    desc: "餐厅、口味与结账",
    kind: "phrases",
    threshold: 64,
    lessons: [
      {
        title: "在餐厅开口",
        intro: "주세요 是「请给我」，万能到几乎能接任何名词。指菜单上的菜时直接说「이거 주세요」最省事。",
        items: [
          { ko: "메뉴 주세요", roman: "menyu juseyo", zh: "请给我菜单", note: "메뉴 是外来词 menu，按音节清晰读。", ex: { ko: "메뉴 좀 주세요.", roman: "menyu jom juseyo", zh: "请给我看一下菜单。" } },
          { ko: "이거 주세요", roman: "igeo juseyo", zh: "请给我这个", note: "指着菜单或商品时最实用的一句。", ex: { ko: "이거 하나 주세요.", roman: "igeo hana juseyo", zh: "请给我这个一份。" } },
          { ko: "물 주세요", roman: "mul juseyo", zh: "请给我水", note: "ㄹ 收音舌尖要翘起抵住上齿龈。", ex: { ko: "물 좀 주세요.", roman: "mul jom juseyo", zh: "请给我点水。" } },
          { ko: "맛있어요", roman: "masisseoyo", zh: "很好吃", note: "있 的 ㅆ 在元音前读紧音，所以是「마시써요」。", ex: { ko: "정말 맛있어요!", roman: "jeongmal masisseoyo", zh: "真的很好吃！" } },
          { ko: "하나 더 주세요", roman: "hana deo juseyo", zh: "请再给我一个", note: "더 表示「再、另外」。", ex: { ko: "이거 하나 더 주세요.", roman: "igeo hana deo juseyo", zh: "请再给我这个一份。" } }
        ]
      },
      {
        title: "结账与口味",
        intro: "韩国餐厅多数要在柜台结账。吃之前说「잘 먹겠습니다」，吃完说「잘 먹었습니다」是很加分的礼仪。",
        items: [
          { ko: "계산해 주세요", roman: "gyesanhae juseyo", zh: "请结账", note: "ㅅ 在元音前读 [s]，连读成「계사내」。", ex: { ko: "여기요, 계산해 주세요.", roman: "yeogiyo, gyesanhae juseyo", zh: "服务员，请结账。" } },
          { ko: "얼마예요?", roman: "eolmayeyo", zh: "多少钱？", note: "얼 的 ㄹ 收音要翘舌收住。", ex: { ko: "이거 얼마예요?", roman: "igeo eolmayeyo", zh: "这个多少钱？" } },
          { ko: "안 매워요", roman: "an maewoyo", zh: "不辣", note: "안 的 ㄴ 与 ㅁ 相邻，读起来很顺滑。", ex: { ko: "이거 안 매워요?", roman: "igeo an maewoyo", zh: "这个不辣吗？" } },
          { ko: "잘 먹겠습니다", roman: "jal meokgesseumnida", zh: "我开动了", note: "吃饭前的固定客套，字面是「我会好好吃」。", ex: { ko: "잘 먹겠습니다!", roman: "jal meokgesseumnida", zh: "我开动啦！" } },
          { ko: "잘 먹었습니다", roman: "jal meogeotseumnida", zh: "我吃好了", note: "吃完后的固定客套。", ex: { ko: "잘 먹었습니다. 감사합니다.", roman: "jal meogeotseumnida", zh: "我吃好了，谢谢。" } }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "住宿与交通",
    desc: "入住、问路、乘车",
    kind: "phrases",
    threshold: 62,
    lessons: [
      {
        title: "办理入住",
        intro: "前台沟通通常很简短。说一句「예약했어요」再递护照，流程就走通了。",
        items: [
          { ko: "예약했어요", roman: "yeyakhaesseoyo", zh: "我预订了", note: "했어요 里的 ㅎ 很轻，几乎一带而过。", ex: { ko: "어제 예약했어요.", roman: "eoje yeyakhaesseoyo", zh: "我昨天预订了。" } },
          { ko: "체크인하고 싶어요", roman: "chekeu-inhago sipeoyo", zh: "我想办理入住", note: "外来词按音节清晰读出，不要连成一片。", ex: { ko: "지금 체크인하고 싶어요.", roman: "jigeum chekeu-inhago sipeoyo", zh: "我现在想办理入住。" } },
          { ko: "방 있어요?", roman: "bang isseoyo", zh: "有房间吗？", note: "있어요 的 ㅆ 在元音前读紧音。", ex: { ko: "오늘 빈방 있어요?", roman: "oneul binbang isseoyo", zh: "今天有空房吗？" } },
          { ko: "와이파이 있어요?", roman: "waipai isseoyo", zh: "有无线网络吗？", note: "外来词 wifi，按「와이파이」三音节读。", ex: { ko: "와이파이 비밀번호 뭐예요?", roman: "waipai bimilbeonho mwoyeyo", zh: "无线密码是多少？" } },
          { ko: "열쇠 주세요", roman: "yeolsoe juseyo", zh: "请给我钥匙", note: "ㅙ 现代多读成接近 [we]。", ex: { ko: "방 열쇠 주세요.", roman: "bang yeolsoe juseyo", zh: "请给我房间钥匙。" } }
        ]
      },
      {
        title: "问路与乘车",
        intro: "韩国地址不好念，最实用的办法是把目的地给司机看，再配合下面几句。",
        items: [
          { ko: "지하철역이 어디예요?", roman: "jihacheol-yeogi eodiyeyo", zh: "地铁站在哪里？", note: "역의 的 ㄱ 在元音前读 [g]，连成「여기」。", ex: { ko: "실례합니다, 지하철역이 어디예요?", roman: "sillyehamnida", zh: "打扰一下，地铁站在哪？" } },
          { ko: "여기로 가 주세요", roman: "yeogiro ga juseyo", zh: "请去这里", note: "로 表示方向；指着地图或地址说这句。", ex: { ko: "이 주소로 가 주세요.", roman: "i jusoro ga juseyo", zh: "请去这个地址。" } },
          { ko: "내려 주세요", roman: "naeryeo juseyo", zh: "请让我下车", note: "려 读 ryeo，公交车和出租车都通用。", ex: { ko: "다음 정류장에 내려 주세요.", roman: "daeum jeongnyujang-e naeryeo juseyo", zh: "请在下一站让我下车。" } },
          { ko: "얼마나 걸려요?", roman: "eolmana geollyeoyo", zh: "需要多久？", note: "걸려요 里的 ㄹ 要弹舌。", ex: { ko: "여기까지 얼마나 걸려요?", roman: "yeogikkaji eolmana geollyeoyo", zh: "到这儿需要多久？" } },
          { ko: "화장실이 어디예요?", roman: "hwajangsil-i eodiyeyo", zh: "洗手间在哪里？", note: "실이 的 ㄹ 与元音连读，读成「시리」。", ex: { ko: "화장실이 어디예요?", roman: "hwajangsil-i eodiyeyo", zh: "请问洗手间在哪儿？" } }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "求助与付款",
    desc: "求助、购物与生活表达",
    kind: "phrases",
    threshold: 60,
    lessons: [
      {
        title: "需要帮助时",
        intro: "这几句在紧急情况下最重要，语速慢一点、加上手势，对方基本都能明白。",
        items: [
          { ko: "도와주세요", roman: "dowajuseyo", zh: "请帮帮我", note: "와 与 주 连贯读出，中间不要停顿。", ex: { ko: "저기요, 좀 도와주세요.", roman: "jeogiyo, jom dowajuseyo", zh: "不好意思，请帮我一下。" } },
          { ko: "천천히 말해 주세요", roman: "cheoncheonhi malhae juseyo", zh: "请说慢一点", note: "ㅎ 较轻但要保留节奏，不要整个吞掉。", ex: { ko: "죄송하지만 천천히 말해 주세요.", roman: "joesonghajiman", zh: "抱歉，请您说慢一点。" } },
          { ko: "다시 한 번 말해 주세요", roman: "dasi han beon malhae juseyo", zh: "请再说一遍", note: "한 번 连读时读成「함 번」。", ex: { ko: "다시 한 번 말해 주세요.", roman: "dasi han beon malhae juseyo", zh: "请再说一次。" } },
          { ko: "한국어를 못 해요", roman: "hangugeo-reul mot haeyo", zh: "我不会韩语", note: "못 的 ㅅ 收音在 해 前读 [t]。", ex: { ko: "죄송해요, 한국어를 못 해요.", roman: "joesonghaeyo", zh: "对不起，我不会韩语。" } },
          { ko: "길을 잃었어요", roman: "gir-eul irheosseoyo", zh: "我迷路了", note: "ㄹ 收音后接元音连读，读成「기를」。", ex: { ko: "죄송한데요, 길을 잃었어요.", roman: "joesonghandeyo", zh: "不好意思，我迷路了。" } }
        ]
      },
      {
        title: "购物与付款",
        intro: "韩国绝大多数店铺都能刷卡。现金、袋子、收据这几句话在便利店和超市都用得上。",
        items: [
          { ko: "카드 돼요?", roman: "kadeu dwaeyo", zh: "可以刷卡吗？", note: "돼요 读 dwaeyo，不要读成「대요」。", ex: { ko: "카드 돼요, 현금 없어요.", roman: "kadeu dwaeyo, hyeongeum eopseoyo", zh: "能刷卡吗？我没带现金。" } },
          { ko: "현금으로 낼게요", roman: "hyeongeum-euro naelgeyo", zh: "我付现金", note: "으로 是工具助词，表示「用……方式」。", ex: { ko: "현금으로 낼게요.", roman: "hyeongeum-euro naelgeyo", zh: "我用现金付。" } },
          { ko: "깎아 주세요", roman: "kkakka juseyo", zh: "便宜一点吧", note: "传统市场可以讲价，百货店不建议。", ex: { ko: "조금만 깎아 주세요.", roman: "jogeumman kkakka juseyo", zh: "请便宜一点点吧。" } },
          { ko: "봉투 주세요", roman: "bongtu juseyo", zh: "请给我袋子", note: "韩国很多便利店袋子要单独收费。", ex: { ko: "봉투 하나 주세요.", roman: "bongtu hana juseyo", zh: "请给我一个袋子。" } },
          { ko: "영수증 주세요", roman: "yeongsujeung juseyo", zh: "请给我收据", note: "증 的 ㅇ 收音是后鼻音 [ng]。", ex: { ko: "영수증도 주세요.", roman: "yeongsujeungdo juseyo", zh: "收据也请给我。" } }
        ]
      }
    ]
  }
];

const MODULES = [MODULE_LETTERS, MODULE_RULES].concat(MODULE_PHRASES);
