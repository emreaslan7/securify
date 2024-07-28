import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "LayoutDashboard",
    title: "Unified Wallet Management",
    description:
      "Effortlessly manage all your wallets from a single, intuitive dashboard. Gain complete control over your assets.",
  },
  {
    icon: "BookOpenText",
    title: "Unmatched Transparency",
    description:
      "Benefit from the transparency of blockchain technology. Every transaction is recorded and auditable, providing complete visibility into your wallet activities",
  },
  {
    icon: "LandPlot",
    title: "User-Friendly Interface",
    description:
      "Enjoy a seamless user experience without the complexities of blockchain. Our platform simplifies wallet management for everyone.",
  },
  {
    icon: "Globe",
    title: "Seamless Cross-Chain Payments",
    description:
      "Send and receive assets across multiple blockchains with ease. Our platform simplifies cross-chain transactions.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Benefits</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Gateway to Transparent and Secure Finance
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Discover the benefits of our innovative platform and revolutionize
            the way you manage your finances.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    color="hsl(var(--primary))"
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
