import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

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
        <p
          className="text-gray-600 leading-relaxed text-wrap"
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
      </CardContent>
    </Card>
  );
};

export default ProductShortDescription;
