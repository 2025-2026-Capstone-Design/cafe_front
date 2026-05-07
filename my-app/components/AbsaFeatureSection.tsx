import { Brain, TrendingUp, MessageSquare, Target } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "ABSA 감성 분석",
    description: "Aspect-Based Sentiment Analysis로 리뷰의 세부 요소별 감성을 분석합니다",
    metric: "98.2%",
    metricLabel: "분석 정확도",
  },
  {
    icon: Target,
    title: "세분화된 추천",
    description: "커피 맛, 분위기, 서비스 등 원하는 요소에 맞춤 추천을 제공합니다",
    metric: "12+",
    metricLabel: "분석 카테고리",
  },
  {
    icon: MessageSquare,
    title: "실시간 리뷰 분석",
    description: "새로운 리뷰가 등록되면 즉시 분석하여 최신 정보를 반영합니다",
    metric: "50K+",
    metricLabel: "월간 분석 리뷰",
  },
  {
    icon: TrendingUp,
    title: "트렌드 인사이트",
    description: "지역별, 시간대별 인기 카페와 트렌드를 한눈에 파악하세요",
    metric: "실시간",
    metricLabel: "데이터 업데이트",
  },
]

export function AbsaFeatureSection() {
  return (
    <section className="py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            AI가 분석하는 <span className="text-primary">진짜 리뷰</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            수천 개의 리뷰를 ABSA(Aspect-Based Sentiment Analysis) 기술로 분석해
            <br className="hidden sm:block" />
            카페의 진짜 장단점을 알려드립니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {feature.description}
              </p>
              <div className="pt-4 border-t border-border">
                <div className="text-2xl font-bold text-primary">{feature.metric}</div>
                <div className="text-xs text-muted-foreground">{feature.metricLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
