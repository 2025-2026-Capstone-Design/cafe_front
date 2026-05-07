import { ThumbsUp, ThumbsDown, Coffee, Cake, Volume2, Sofa, Users } from "lucide-react"

const analysisData = {
  cafeName: "인기 카페 예시",
  totalReviews: 2847,
  aspects: [
    { label: "커피 맛",    icon: Coffee,  positive: 94, negative: 6  },
    { label: "디저트",     icon: Cake,    positive: 87, negative: 13 },
    { label: "소음 수준",  icon: Volume2, positive: 72, negative: 28 },
    { label: "좌석 편안함", icon: Sofa,   positive: 81, negative: 19 },
    { label: "서비스",     icon: Users,   positive: 89, negative: 11 },
  ],
  sampleReviews: [
    {
      text: "커피가 정말 맛있어요! 산미가 적당하고 고소한 맛이 일품입니다.",
      aspect: "커피 맛",
      sentiment: "positive",
    },
    {
      text: "주말에는 사람이 너무 많아서 좌석 찾기가 힘들어요.",
      aspect: "좌석",
      sentiment: "negative",
    },
  ],
}

export function ReviewAnalysisPreview() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground">리뷰 분석 미리보기</h2>
          <p className="mt-2 text-muted-foreground">
            실제 카페 리뷰를 AI가 어떻게 분석하는지 확인해보세요
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden max-w-4xl mx-auto">
          <div className="bg-secondary px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{analysisData.cafeName}</h3>
                <p className="text-sm text-muted-foreground">
                  총 {analysisData.totalReviews.toLocaleString()}개 리뷰 분석
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <ThumbsUp className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">긍정 87%</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <ThumbsDown className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-foreground">부정 13%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              요소별 감성 분석 (Aspect-Based)
            </h4>
            <div className="space-y-4">
              {analysisData.aspects.map((aspect, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-28 shrink-0">
                    <aspect.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{aspect.label}</span>
                  </div>
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden flex">
                    <div className="bg-primary h-full transition-all" style={{ width: `${aspect.positive}%` }} />
                    <div className="bg-destructive/60 h-full" style={{ width: `${aspect.negative}%` }} />
                  </div>
                  <div className="flex items-center gap-2 w-20 shrink-0 justify-end">
                    <span className="text-sm font-medium text-primary">{aspect.positive}%</span>
                    <span className="text-sm text-muted-foreground">/</span>
                    <span className="text-sm text-destructive">{aspect.negative}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">AI 분석 리뷰 예시</h4>
            <div className="space-y-3">
              {analysisData.sampleReviews.map((review, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    review.sentiment === "positive"
                      ? "bg-primary/5 border-primary/20"
                      : "bg-destructive/5 border-destructive/20"
                  }`}
                >
                  <p className="text-sm text-foreground mb-2">{`"${review.text}"`}</p>
                  <div className="flex items-center gap-2">
                    {review.sentiment === "positive" ? (
                      <ThumbsUp className="h-3 w-3 text-primary" />
                    ) : (
                      <ThumbsDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      분석된 요소: <span className="font-medium">{review.aspect}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
