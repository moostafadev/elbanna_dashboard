import Image from "next/image";
import React from "react";

const Soon = () => {
  return (
    <div className="flex flex-col gap-8 items-center mt-10">
      <Image
        src={"/soon.svg"}
        alt="soon"
        width={200}
        height={200}
        className="max-w-[500px] w-full"
      />
      <p className="text-2xl font-bold">قريباً</p>
    </div>
  );
};

export default Soon;
