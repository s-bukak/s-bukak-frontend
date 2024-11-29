const StatusIndicator = ({ status }) => {
    let bgColor;
    let textColor;
    let borderColor;

    switch (status) {
        case "참여완료":
            bgColor = "bg-red-100";
            textColor = "text-red-500";
            borderColor = "border-red-500";
            break;
        case "예측진행중":
            bgColor = "bg-lime-200";
            textColor = "text-lime-700";
            borderColor = "border-lime-700";
            break;
        case "진행예정" || "예측예정":
            bgColor = "bg-sky-100";
            textColor = "text-sky-600";
            borderColor = "border-sky-600";
            break;
        default:
            bgColor = "bg-gray-200";
            textColor = "text-gray-500";
            borderColor = "border-gray-500";
    }

    return (
        <span className={`flex items-center justify-center ${bgColor} ${textColor} ${borderColor} w-[90px] py-0.5 rounded-md text-xs border`}>
            {status}
        </span>
    );
}

export default StatusIndicator;
