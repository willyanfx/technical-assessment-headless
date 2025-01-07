import FeaturedCollection from 'components/collection/featuredCollection';
import Footer from 'components/layout/footer';

export const metadata = {
  title: 'Technical Assessment Test',
  description: 'Product Tile',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  return (
    <>
      <FeaturedCollection />
      <Footer />
    </>
  );
}

/* <Carousel /> */
