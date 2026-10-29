import { useParams } from "react-router-dom";
import Main from '../components/main'
import Header from "../components/Header";
import Footer from "../components/Footer";
function CategoryPage() {
  // useParams() returns an object: { category: "science_technology", ... }
  // Destructure it so `category` is a string, not [object Object].
  const { category } = useParams();

  return (
    <>
    <Header />
        <Main initialCategory={category} />
        <Footer />
    </>

  );
}

export default CategoryPage;
