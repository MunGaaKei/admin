export default function ErrorDisplay() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("errorCode") || "500";

    return (
        <div className="flex flex-1 h-100">
            <h2 className="mg-auto" style={{ fontSize: 60 }}>
                {code}
            </h2>
        </div>
    );
}
