type Props = {
  symbol: string;
  price?: number;
  changePercentage?: number; // Added for daily change calculation
  changeColor?: string; // Added for daily change color
};

export default function StockCard({
  symbol,
  price,
  changePercentage,
  changeColor,
}: Props) {
  return (
    <div className="card">
      <div className="text-lg font-semibold">{symbol}</div>
      <div className="text-gray-500">
        {price ? `$${price.toFixed(2)}` : "—"}
      </div>
      {changePercentage !== undefined && (
        <div
          className={`text-sm ${changeColor === "red" ? "text-red-500" : "text-blue-500"}`}
        >
          {changePercentage.toFixed(2)}%
        </div>
      )}
    </div>
  );
}
