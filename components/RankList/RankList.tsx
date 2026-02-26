interface RankItem {
  name: string;
  value: number;
  color: string;
  label?: string;
}

interface RankListProps {
  items: RankItem[];
}

export default function RankList({ items }: RankListProps) {
  return (
    <div className="rank-list">
      {items.map((item, i) => (
        <div key={i} className="rank-item">
          <span className="rank-name">{item.name}</span>
          <div className="rank-bar-track">
            <div
              className="rank-bar"
              style={{ width: `${item.value}%`, background: item.color }}
            />
          </div>
          <span className="rank-val">{item.label ?? `${item.value}%`}</span>
        </div>
      ))}
    </div>
  );
}
