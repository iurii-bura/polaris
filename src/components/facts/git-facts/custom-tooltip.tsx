const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className="bg-base-100 border border-base-300 rounded-lg shadow-lg p-3">
                <p className="font-semibold text-base-content mb-2">{label}</p>
                {payload.map((entry: any) => (
                    <div
                        key={entry.name}
                        className="flex items-center gap-2 text-sm"
                    >
                        <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-base-content">
                            {entry.name}: <span className="font-medium">{entry.value} commits</span>
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
