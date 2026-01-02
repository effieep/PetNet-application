import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LostAndFoundHeader from "../components/lostandfound_main_header.jsx";
import FoundPetRequirements from "../components/LostAndFound_main_Requirements1.jsx";

const LostFound = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setLoginOpen(true);

      // optional: clean URL after opening
      searchParams.delete("login");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      <LostAndFoundHeader />
      <FoundPetRequirements />
        <div>
        {/* <h1> Lost Found </h1> */}
        </div>
    </>
  );
};

export default LostFound;