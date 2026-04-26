import { Cafe } from './types'

export const MOCK_CAFES: Cafe[] = [
  {
    id: 1,
    name: '온도 커피로스터스',
    address: '서울 마포구 연남동 000-00',
    reviewCount: 312,
    score: 92,
    isOpen: true,
    aspectScores: {
      coffee:  91, bakery: 72, cake:    0,  cookie: 65,
      bingsu:   0, dessert: 55, space:  88, vibe:   90,
      service: 78, price:  62, gift:   45,  crowd:  40,
    },
    keywords: {
      coffee:  [
        { text: '스페셜티',   sentiment: 'pos', count: 48 },
        { text: '핸드드립',   sentiment: 'pos', count: 35 },
        { text: '산미',       sentiment: 'pos', count: 22 },
        { text: '아메리카노', sentiment: 'pos', count: 18 },
        { text: '쓴맛',       sentiment: 'neg', count:  7 },
      ],
      vibe: [
        { text: '조용함',   sentiment: 'pos', count: 55 },
        { text: '감성적',   sentiment: 'pos', count: 41 },
        { text: '아늑함',   sentiment: 'pos', count: 33 },
        { text: '시끄러움', sentiment: 'neg', count:  5 },
      ],
      space: [
        { text: '넓은 좌석',   sentiment: 'pos', count: 44 },
        { text: '콘센트 있음', sentiment: 'pos', count: 30 },
        { text: '주차 불편',   sentiment: 'neg', count: 12 },
      ],
      crowd: [
        { text: '웨이팅 있음', sentiment: 'neg', count: 35 },
        { text: '주말 혼잡',   sentiment: 'neg', count: 28 },
        { text: '회전 빠름',   sentiment: 'pos', count: 10 },
      ],
    },
    amenities: {
      parking: false, wifi: true,  outlet: true, pet: false,
      takeout: true,  group: false, reservation: true, kids: false,
    },
  },
  {
    id: 2,
    name: '블루문 베이커리',
    address: '서울 서대문구 북아현동 000-00',
    reviewCount: 198,
    score: 87,
    isOpen: true,
    aspectScores: {
      coffee:  74, bakery: 95, cake:   88, cookie: 91,
      bingsu:   0, dessert: 70, space: 65, vibe:   80,
      service: 85, price:  75, gift:  82, crowd:   50,
    },
    keywords: {
      bakery: [
        { text: '크루아상', sentiment: 'pos', count: 27 },
        { text: '소금빵',   sentiment: 'pos', count: 24 },
        { text: '스콘',     sentiment: 'pos', count: 18 },
        { text: '퍽퍽함',   sentiment: 'neg', count:  6 },
      ],
      cake: [
        { text: '딸기케이크', sentiment: 'pos', count: 32 },
        { text: '생크림',     sentiment: 'pos', count: 20 },
      ],
      gift: [
        { text: '선물 포장',  sentiment: 'pos', count: 30 },
        { text: '박스 예쁨',  sentiment: 'pos', count: 18 },
      ],
    },
    amenities: {
      parking: false, wifi: true,  outlet: false, pet: false,
      takeout: true,  group: true,  reservation: false, kids: false,
    },
  },
  {
    id: 3,
    name: '여름날의 빙수',
    address: '서울 성동구 성수동 000-00',
    reviewCount: 445,
    score: 84,
    isOpen: true,
    aspectScores: {
      coffee:  55, bakery: 30, cake:   45, cookie:  0,
      bingsu:  97, dessert: 88, space: 75, vibe:   85,
      service: 72, price:  60, gift:  30, crowd:   25,
    },
    keywords: {
      bingsu: [
        { text: '팥빙수',   sentiment: 'pos', count: 62 },
        { text: '과일빙수', sentiment: 'pos', count: 48 },
        { text: '양 많음',  sentiment: 'pos', count: 35 },
      ],
      crowd: [
        { text: '주말 웨이팅', sentiment: 'neg', count: 55 },
        { text: '1시간 대기',  sentiment: 'neg', count: 30 },
      ],
      vibe: [
        { text: '인스타 감성', sentiment: 'pos', count: 42 },
        { text: '포토존',      sentiment: 'pos', count: 28 },
      ],
    },
    amenities: {
      parking: false, wifi: true,  outlet: false, pet: false,
      takeout: true,  group: false, reservation: false, kids: true,
    },
  },
  {
    id: 4,
    name: '평일의 여백',
    address: '서울 종로구 삼청동 000-00',
    reviewCount: 156,
    score: 80,
    isOpen: false,
    aspectScores: {
      coffee:  82, bakery: 60, cake:   70, cookie: 55,
      bingsu:   0, dessert: 60, space: 92, vibe:   94,
      service: 88, price:  50, gift:  40, crowd:   78,
    },
    keywords: {
      vibe: [
        { text: '한옥 공간', sentiment: 'pos', count: 48 },
        { text: '조용함',    sentiment: 'pos', count: 40 },
        { text: '힐링',      sentiment: 'pos', count: 30 },
      ],
      space: [
        { text: '마당 있음',   sentiment: 'pos', count: 35 },
        { text: '좌석 여유',   sentiment: 'pos', count: 22 },
      ],
      price: [
        { text: '가성비 낮음', sentiment: 'neg', count: 28 },
        { text: '음료 비쌈',   sentiment: 'neg', count: 20 },
      ],
    },
    amenities: {
      parking: true,  wifi: false, outlet: false, pet: true,
      takeout: false, group: false, reservation: true, kids: false,
    },
  },
  {
    id: 5,
    name: '커피앤케이크',
    address: '서울 용산구 이태원동 000-00',
    reviewCount: 289,
    score: 78,
    isOpen: true,
    aspectScores: {
      coffee:  80, bakery: 50, cake:   92, cookie: 70,
      bingsu:   0, dessert: 75, space: 70, vibe:   78,
      service: 80, price:  55, gift:  65, crowd:   45,
    },
    keywords: {
      cake: [
        { text: '딸기 케이크', sentiment: 'pos', count: 55 },
        { text: '생일케이크',  sentiment: 'pos', count: 40 },
        { text: '비주얼 좋음', sentiment: 'pos', count: 33 },
        { text: '예약 필수',   sentiment: 'neg', count: 22 },
      ],
      coffee: [
        { text: '라떼 맛있음', sentiment: 'pos', count: 30 },
        { text: '디카페인',    sentiment: 'pos', count: 18 },
      ],
    },
    amenities: {
      parking: false, wifi: true,  outlet: true, pet: false,
      takeout: true,  group: true,  reservation: true, kids: false,
    },
  },
  {
    id: 6,
    name: '그라운드 로스터리',
    address: '서울 강남구 압구정동 000-00',
    reviewCount: 501,
    score: 75,
    isOpen: true,
    aspectScores: {
      coffee:  88, bakery: 65, cake:   40, cookie: 50,
      bingsu:   0, dessert: 45, space: 80, vibe:   72,
      service: 70, price:  40, gift:  35, crowd:   30,
    },
    keywords: {
      coffee: [
        { text: '콜드브루',   sentiment: 'pos', count: 60 },
        { text: '원두 다양',  sentiment: 'pos', count: 40 },
        { text: '가격 있음',  sentiment: 'neg', count: 35 },
      ],
      space: [
        { text: '넓은 공간', sentiment: 'pos', count: 45 },
        { text: '작업하기 좋음', sentiment: 'pos', count: 38 },
      ],
      crowd: [
        { text: '평일 한산', sentiment: 'pos', count: 28 },
        { text: '주말 혼잡', sentiment: 'neg', count: 22 },
      ],
    },
    amenities: {
      parking: true,  wifi: true,  outlet: true, pet: false,
      takeout: true,  group: true,  reservation: false, kids: false,
    },
  },
]