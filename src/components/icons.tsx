import type { IconType } from "react-icons";
import {
  MdAdd,
  MdArrowBack,
  MdArrowForward,
  MdAssignment,
  MdCheck,
  MdCheckCircleOutline,
  MdClose,
  MdDeleteOutline,
  MdDownload,
  MdEdit,
  MdFolderOpen,
  MdLanguage,
  MdMenu,
  MdSpeed,
  MdHistoryEdu,
} from "react-icons/md";
import { SiGithub } from "react-icons/si";

export interface IconProps {
  className?: string;
}

function makeIcon(Icon: IconType) {
  return function WrappedIcon({ className = "h-5 w-5" }: IconProps) {
    return <Icon aria-hidden="true" className={className} />;
  };
}

export const IconAdd = makeIcon(MdAdd);
export const IconArrowBack = makeIcon(MdArrowBack);
export const IconArrowForward = makeIcon(MdArrowForward);
export const IconAssignment = makeIcon(MdAssignment);
export const IconCheck = makeIcon(MdCheck);
export const IconCheckCircle = makeIcon(MdCheckCircleOutline);
export const IconClose = makeIcon(MdClose);
export const IconDelete = makeIcon(MdDeleteOutline);
export const IconDownload = makeIcon(MdDownload);
export const IconEdit = makeIcon(MdEdit);
export const IconFolderOpen = makeIcon(MdFolderOpen);
export const IconLanguage = makeIcon(MdLanguage);
export const IconMenu = makeIcon(MdMenu);
export const IconSpeed = makeIcon(MdSpeed);
export const IconHistoryEdu = makeIcon(MdHistoryEdu);
export const IconGithub = makeIcon(SiGithub);
