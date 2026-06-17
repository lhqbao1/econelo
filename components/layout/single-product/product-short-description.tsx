import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import ProductDescriptionLightbox from "./product-description-lightbox";

interface ProductShortDescriptionProps {
  description: string;
}

const ProductShortDescription = ({
  description,
}: ProductShortDescriptionProps) => {
  const t = useTranslations();
  return (
    <Card className="shadow-lg overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t("description")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductDescriptionLightbox description={description} />
      </CardContent>
    </Card>
  );
};

export default ProductShortDescription;
