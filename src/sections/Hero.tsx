import ArrowRight from "@/assets/arrow-right.svg";
import Image from "next/image";
import cogImage from "@/assets/robodog.png";
import cylinderImage from "@/assets/cylinder.png";
import noodleImage from "@/assets/noodle.png";

export const Hero = () => {
  return (
    <section className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#86c3ba,#EAEEFE_100%)] overflow-x-clip">
      <div className="container mx-auto">
        <div className="md:flex items-center">
          <div className="pl-4 pr-4 md:w-[478px] lg:pl-10 ">
            <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">
              Now out for your pets!
            </div>
            <h1 className="pt-4 text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text inline-block">
              Caring for Your Pets Like a Pro
            </h1>
            <p className="text-xl text-[#010D3E] tracking-tight mt-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec
              elit non nibh aliquam bibendum. Donec ac libero a dolor mollis
              fringilla vel lacinia magna. Ut scelerisque ornare nisi sit amet
              consequat. Sed condimentum massa in bibendum volutpat. Praesent
              vitae viverra mi, sed vulputate erat. Duis posuere ligula id nisi
              dictum accumsan.
            </p>
            <div className="flex gap-2 items-center mt-[30px]">
              <button className="btn btn-primary">Sign Up</button>
              <button className="btn btn-text">
                <span>Learn More</span>
                <Image
                  src={ArrowRight}
                  alt="Arrow Right"
                  width={20}
                  height={20}
                  className="pl-1"
                />
              </button>
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <Image
              src={cogImage}
              alt="Cog image"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-20"
            />
            <Image
              src={cylinderImage}
              width={220}
              height={220}
              alt="Cylinder image"
              className="hidden md:block -top-8 -left-32 md:absolute lg:right-0"
            />
            <Image
              src={noodleImage}
              width={220}
              alt="Noodle image"
              className="hidden lg:block absolute top-[524px] left-[500px] rotate-[30deg] lg:left-160"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
