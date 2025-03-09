// app/api/search/route.ts
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("image")

  // TODO: 실제 이미지 처리 로직을 추가합니다.
  // 현재는 모의 데이터를 반환합니다.
  const results = [
    { productName: "Product A", price: "₩15,000", link: "#" },
    { productName: "Product A (Alternative)", price: "₩12,500", link: "#" },
  ]

  return NextResponse.json(results)
}
