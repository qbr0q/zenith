import { formatTimeAgo } from "../utils";


const FormatTime = ({create_date}) => {
    return <>
        <span className="font-thin text-[13px]"
              title={new Date(create_date).toLocaleString()}
        >
            {formatTimeAgo(create_date)}
        </span>
    </>
}

export default FormatTime