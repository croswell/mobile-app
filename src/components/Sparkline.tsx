import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { EarningsPoint } from "../types/finance";

type Props = { data: EarningsPoint[]; stroke?: string; height?: number; };

export default function Sparkline({ data, stroke = "#22c55e", height = 48 }: Props) {
  if (!data.length) return <View style={{ height }} />;
  const w = Math.max(1, data.length - 1);
  const min = Math.min(...data.map(d => d.profit), 0);
  const max = Math.max(...data.map(d => d.profit), 0.01);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / w) * 100;
    const y = 100 - ((d.profit - min) / range) * 100;
    return { x, y };
  });

  const dAttr = points.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");

  return (
    <View style={{ height }}>
      <Svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
        <Path d={dAttr} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      </Svg>
    </View>
  );
}
