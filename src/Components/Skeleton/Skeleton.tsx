import React from "react";
// import { fontSize } from "tailwindcss/defaultTheme.js";

function SkeletonComponent({
  style,
  className,
}: {
  style: any;
  className?: string;
}) {
  // fix className
  return <span className={`skeleton ${className}`} style={style}></span>;
}

type skeletonPropType = {
  count?: number;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  className?: string;
};

const Skeleton: React.FC<skeletonPropType> = ({
  count = 1,
  width,
  height,
  style,
  className,
}) => {
  const skeletonStyle = { ...style };
  if (typeof width === "string" || typeof width === "number") {
    skeletonStyle.width = width;
  }

  if (typeof height === "string" || typeof height === "number") {
    skeletonStyle.height = height;
  }

  const skeletons = Array.from({ length: count });

  // let skeletonClassName = className
  //   ?.split(" ")
  //   .map((item) => {
  //     if (item.match("text")) {
  //       const size = item.split("text-")[1] as any;
  //       const value = fontSize[size][0];
  //       console.log(value);
  //       return `h-[${value}]`;
  //     }
  //     return item;
  //   })
  //   .join(" ");

  return (
    <>
      {skeletons.map((_, index) => (
        <SkeletonComponent
          key={index}
          style={skeletonStyle}
          className={className}
        />
      ))}
    </>
  );
};

export default Skeleton;
