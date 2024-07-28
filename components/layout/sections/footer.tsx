import { Separator } from "@/components/ui/separator";
import { ChevronsDownIcon } from "lucide-react";
import Link from "next/link";
import logo from "@/public/securify_logo.png";
import Image from "next/image";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        {/* <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8"> */}
        <div className="flex items-center justify-between gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="#" className="flex font-bold items-center">
              <Image src={logo} alt="Securify" width={40} height={40} />
              <h3 className="text-2xl">Securify</h3>
            </Link>
          </div>

          <div className="flex items-center justify-between gap-x-12">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-lg">Contact</h3>
              <div>
                <Link
                  href="https://github.com/emreaslan7/securify"
                  className="opacity-60 hover:opacity-100"
                  target="_blank"
                >
                  Github
                </Link>
              </div>

              <div>
                <Link
                  href="https://x.com/blockenddev"
                  className="opacity-60 hover:opacity-100"
                  target="_blank"
                >
                  Twitter
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-lg">Help</h3>
              <div>
                <Link
                  href="mailto:emreaslan.eth@gmail.com"
                  className="opacity-60 hover:opacity-100"
                  target="_blank"
                >
                  Contact Us
                </Link>
              </div>

              <div>
                <Link
                  href="mailto:emreaslan.eth@gmail.com"
                  className="opacity-60 hover:opacity-100"
                  target="_blank"
                >
                  Feedback
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">
            &copy; 2024 developed by
            <Link
              target="_blank"
              href="https://github.com/emreaslan7"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              Emre Aslan
            </Link>
          </h3>
        </section>
      </div>
    </footer>
  );
};
