import {
  FaAngleRight,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleDoubleLeft,
  FaSortAlphaUp,
  FaSortAlphaDown,
  FaKey,
} from "react-icons/fa";

import { BsCalendar2DateFill } from "react-icons/bs";
import { CiSquareMinus } from "react-icons/ci";
import { GoNumber } from "react-icons/go";
import { IoText } from "react-icons/io5";
import { MdPushPin } from "react-icons/md";
import { TiPin } from "react-icons/ti";
import { TbPhotoPlus } from "react-icons/tb";

const icons = {
  INTEGER: <GoNumber role="img" aria-label="integer icon" />,
  TEXT: <IoText role="img" aria-label="text icon" />,
  DATETIME: <BsCalendar2DateFill role="img" aria-label="datetime icon" />,
  pinDown: <MdPushPin role="img" aria-label="pin down icon" />,
  pinUp: <TiPin role="img" aria-label="pin up icon" />,
  none: <CiSquareMinus role="img" aria-label="none icon" />,
  angleRight: <FaAngleRight role="img" aria-label="angle right icon" />,
  angleDoubleRight: (
    <FaAngleDoubleRight role="img" aria-label="angle double right icon" />
  ),
  angleLeft: <FaAngleLeft role="img" aria-label="angle left icon" />,
  angleDoubleLeft: (
    <FaAngleDoubleLeft role="img" aria-label="angle double left icon" />
  ),
  sortAlphaUp: <FaSortAlphaUp role="img" aria-label="sort alpha up icon" />,
  sortAlphaDown: (
    <FaSortAlphaDown role="img" aria-label="sort alpha down icon" />
  ),
  primaryKey: (
    <FaKey
      className="text-yellow-500"
      role="img"
      aria-label="primaryKey icon"
    />
  ),
  foreignKey: (
    <FaKey className="text-gray-700" role="img" aria-label="foreignKey icon" />
  ),
  fileInput: (
    <TbPhotoPlus
      className="text-blue-600"
      role="img"
      aria-label="input database file icon"
    />
  ),
};

type IconKeys = keyof typeof icons;

const IconComponent = ({ IconType }: { IconType: string }) => {
  if (IconType in icons) {
    return <>{icons[IconType as IconKeys]}</>;
  }
  return null;
};

export default IconComponent;
