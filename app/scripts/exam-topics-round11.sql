-- 세계사능력검정시험 제11회 기출 토픽 INSERT
-- 총 50개 토픽 추출 (문제+해설 분석 기반)

INSERT INTO exam_topics (keyword, era, region, exam_level, frequency, rounds) VALUES

-- 고대 그리스·로마·서아시아
('잉카 제국, 키푸, 마추픽추, 쿠스코', 'early-modern', 'americas', 'basic', 1, ARRAY[11]),
('클레이스테네스, 500인 평의회, 도편추방제, 10부족제', 'ancient', 'europe', 'advanced', 1, ARRAY[11]),
('콘스탄티누스 황제, 밀라노 칙령, 콘스탄티노폴리스 천도', 'ancient', 'europe', 'advanced', 1, ARRAY[11]),
('카르타고, 페니키아, 포에니 전쟁, 지중해 무역', 'ancient', 'middle-east-africa', 'basic', 1, ARRAY[11]),
('헬레니즘 문화, 알렉산드로스 동서융합, 간다라 미술', 'ancient', 'europe', 'advanced', 1, ARRAY[11]),
('흉노, 한 왕조, 황건적의 난, 반초', 'ancient', 'asia', 'advanced', 1, ARRAY[11]),
('왕망의 개혁, 토지 국유화, 노비 매매 금지, 왕전제', 'ancient', 'asia', 'advanced', 1, ARRAY[11]),
('춘추전국시대, 맹자, 도전·포전 화폐', 'ancient', 'asia', 'advanced', 1, ARRAY[11]),

-- 중세
('성상 파괴령, 동서 교회 분열, 레오 3세, 그리스 정교', 'medieval', 'europe', 'advanced', 1, ARRAY[11]),
('그레고리우스 7세, 하인리히 4세 파문, 카노사의 굴욕', 'medieval', 'europe', 'advanced', 1, ARRAY[11]),
('십자군 전쟁, 우르바누스 2세, 셀주크 튀르크, 클레르몽 공의회', 'medieval', 'europe', 'basic', 1, ARRAY[11]),
('장미 전쟁, 헨리 7세, 튜더 왕조 개창', 'medieval', 'europe', 'advanced', 1, ARRAY[11]),
('카롤루스 대제, 궁정학교, 카롤루스 르네상스, 서로마 황제', 'medieval', 'europe', 'advanced', 1, ARRAY[11]),
('수나라, 대운하, 과거제 시행, 고구려 침공', 'medieval', 'asia', 'advanced', 1, ARRAY[11]),
('당나라, 현장 대당서역기, 혜초 왕오천축국전, 엔닌', 'medieval', 'asia', 'advanced', 1, ARRAY[11]),
('원나라, 대도 천도, 교초, 색목인, 수시력 제작', 'medieval', 'asia', 'advanced', 1, ARRAY[11]),
('금나라(여진), 정강의 변, 남송 천도 배경', 'medieval', 'asia', 'advanced', 1, ARRAY[11]),
('나라 시대, 도다이사, 일본서기 편찬', 'medieval', 'asia', 'advanced', 1, ARRAY[11]),

-- 근세
('루터, 95개조 반박문, 면벌부 판매, 종교개혁', 'early-modern', 'europe', 'advanced', 1, ARRAY[11]),
('에스파냐, 콜럼버스, 아스테카 제국 침략', 'early-modern', 'americas', 'basic', 1, ARRAY[11]),
('표트르 대제, 북방 전쟁, 발트해 진출, 상트페테르부르크', 'early-modern', 'europe', 'advanced', 1, ARRAY[11]),
('과학 혁명, 코페르니쿠스 지동설, 베살리우스 해부학', 'early-modern', 'europe', 'advanced', 1, ARRAY[11]),
('청교도 혁명, 크롬웰 호국경, 찰스 1세 처형', 'early-modern', 'europe', 'advanced', 1, ARRAY[11]),
('무굴 제국, 타지마할, 샤자한, 우르두어', 'early-modern', 'asia', 'advanced', 1, ARRAY[11]),
('청 강희제, 팔기군, 삼번의 난, 네르친스크 조약', 'early-modern', 'asia', 'advanced', 1, ARRAY[11]),

-- 근대
('미국 독립혁명, 인지세법, 보스턴 차 사건, 파리 조약', 'modern', 'americas', 'basic', 1, ARRAY[11]),
('나폴레옹, 대륙봉쇄령, 신성 로마 제국 해체', 'modern', 'europe', 'basic', 1, ARRAY[11]),
('독일 통일, 관세 동맹, 비스마르크 철혈정책, 독일 제국', 'modern', 'europe', 'advanced', 1, ARRAY[11]),
('영국·프랑스 식민지 대립, 파쇼다 사건', 'modern', 'middle-east-africa', 'advanced', 1, ARRAY[11]),
('1차 세계대전, 국제 연맹 창설, 독일 식민지 상실', 'modern', 'europe', 'basic', 1, ARRAY[11]),
('레닌 4월 테제, 브레스트리토프스크 조약, 러시아 혁명', 'modern', 'europe', 'advanced', 1, ARRAY[11]),
('2차 세계대전, 스탈린그라드 전투, 노르망디 상륙작전', 'modern', 'europe', 'advanced', 1, ARRAY[11]),
('오스만 제국, 탄지마트, 무스타파 케말, 튀르키예 공화국', 'modern', 'middle-east-africa', 'advanced', 1, ARRAY[11]),
('의화단 운동, 신축조약, 외국군 베이징 주둔', 'modern', 'asia', 'advanced', 1, ARRAY[11]),
('신해혁명, 철도국유화 반대, 쑨원 임시대총통', 'modern', 'asia', 'basic', 1, ARRAY[11]),
('제2차 국공합작, 시안 사건, 홍군 국민혁명군 개편', 'modern', 'asia', 'advanced', 1, ARRAY[11]),
('세포이 항쟁, 인도 동인도회사 해체, 영국령 인도 제국', 'modern', 'asia', 'advanced', 1, ARRAY[11]),
('일본 메이지 헌법, 천황 통치권, 메이지 정부', 'modern', 'asia', 'advanced', 1, ARRAY[11]),
('삼국간섭, 랴오둥반도 반환, 러시아·독일·프랑스', 'modern', 'asia', 'advanced', 1, ARRAY[11]),
('판보이쩌우, 동유 운동, 베트남 광복회', 'modern', 'asia', 'advanced', 1, ARRAY[11]),

-- 현대
('냉전, 트루먼 독트린, 쿠바 미사일 위기, 베를린 장벽', 'contemporary', 'europe', 'advanced', 1, ARRAY[11]),
('고르바초프, 글라스노스트, 페레스트로이카, 노벨평화상', 'contemporary', 'europe', 'advanced', 1, ARRAY[11]),
('덩샤오핑, 남순강화, 개혁개방, 경제특구', 'contemporary', 'asia', 'advanced', 1, ARRAY[11]),
('인도네시아, 보로부두르, 반둥 아시아·아프리카 회의', 'contemporary', 'asia', 'basic', 1, ARRAY[11]),
('이스라엘, 밸푸어 선언, 팔레스타인 분쟁', 'contemporary', 'middle-east-africa', 'advanced', 1, ARRAY[11]),
('APEC, 싱가포르 사무국, 홍콩·타이완 가입', 'contemporary', 'asia', 'none', 1, ARRAY[11]),
('프랑스, NATO 재가입, 마크롱', 'contemporary', 'europe', 'none', 1, ARRAY[11]),
('인도, 카슈미르, 파키스탄 대립, 찬드라얀 달 탐사', 'contemporary', 'asia', 'none', 1, ARRAY[11]),
('중국 국민당, 장제스 정치 기반, 대만 선거', 'contemporary', 'asia', 'advanced', 1, ARRAY[11]),
('마스트리흐트 조약, 유럽 공동체, EU 출범', 'contemporary', 'europe', 'basic', 1, ARRAY[11]);
