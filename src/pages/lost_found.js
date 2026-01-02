import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
        <div>
        <h1> Lost Found </h1>
        </div>
    </>
  );
};

export default LostFound;