import { BsCalendar2DateFill } from "react-icons/bs";
import { CiSquareMinus } from "react-icons/ci";
import { GoNumber } from "react-icons/go";
import { IoText } from "react-icons/io5";
import { MdPushPin } from "react-icons/md";
import { TiPin } from "react-icons/ti";

const icons = {
  INTEGER: <GoNumber role="img" aria-label="integer icon" />,
  TEXT: <IoText role="img" aria-label="text icon" />,
  DATETIME: <BsCalendar2DateFill role="img" aria-label="datetime icon" />,
  pinDown: <MdPushPin role="img" aria-label="pin down icon" />,
  pinUp: <TiPin role="img" aria-label="pin up icon" />,
  none: <CiSquareMinus role="img" aria-label="none icon" />,
};

type IconKeys = keyof typeof icons;

const IconComponent = ({ IconType }: { IconType: IconKeys }) => {
  return <>{icons[IconType]}</>;
};

export default IconComponent;
