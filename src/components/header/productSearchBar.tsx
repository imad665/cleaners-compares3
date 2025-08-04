'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BigButton } from "../home_page/mainImage2";
import { useHomeContext } from "@/providers/homePageProvider";
import SellerFormDialog from "../forms/sellerForm";
import SellerFormDialog2 from "../forms/sellerForm2";

export function ProductSearchBar({ isShowBrowser = false }: { isShowBrowser?: boolean }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [openSellerDialog,setOpenSellerDialog] = useState(false);
  const [openDialog,setOpenDialog] = useState(false);
  const [buttonLoading,setButtonLoading] = useState(false);
  const router = useRouter();

  // Debounce input query to avoid sending too many requests while typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // Delay the query for 500ms

    return () => clearTimeout(timeoutId); // Cleanup timeout on query change
  }, [query]);

  // Fetch products based on the debounced query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setProducts([]);
      return;
    }
    //console.log(encodeURIComponent(debouncedQuery),'[[[[[[[[');

    setLoading(true);
    // Fetch products from an API or database
    fetch(`/api/search?query=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => {

        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setProducts([]);
      });
  }, [debouncedQuery]);
  //console.log(products,'bbbbbbbbbbbbbbbbbbb');

  const handleSearch = () => {
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
  };
  const {user} = useHomeContext();
  //console.log(user,';.,,,,,,,,,,,,,');
  
  function handleClickBigButton(){
    if(user){
      if (user.role.toLocaleLowerCase() === 'seller' || user.role.toLocaleLowerCase()==='admin'){
        setButtonLoading(true);
        router.push('/admin/addNewProduct')
      }else{
        setOpenSellerDialog(true);
      }
    }else{
      setOpenDialog(true);
    }
  }

  return (
    <div className="w-full relative max-w-3xl mx-auto text-center space-y-4">
      {/* Search */}
      <div className="flex items-stretch rounded-md overflow-hidden w-full">
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          /* onKeyDown={(e) => e.key === "Enter" && handleSearch()} */
          className="flex-1 rounded-none rounded-l-md border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
        />
        <Button
          onClick={handleSearch}
          variant="default"
          className="bg-yellow-400 rounded-l-none hover:bg-yellow-500 px-4 h-auto border text-black shadow-sm"
        >
          <span className="hidden md:block m-0 p-0">Search</span>
          <Search className="h-5 w-5 md:hidden" />
        </Button>
      </div>

      {/* Loading and Search Results */}
      {loading && <div className="text-sm text-gray-500">Loading...</div>}

      {products.length > 0 && (
        <div
          className="absolute border-1 z-10 top-full mt-2 max-h-60 overflow-y-auto bg-white shadow-lg rounded-md w-full"
          style={{ width: "calc(100% - 2rem)" }} // To ensure the dropdown doesn't extend outside of the container
        >
          {products.map((product) => (
            <Link href={product.href} key={product.id} className="p-3 block hover:bg-gray-100 cursor-pointer">
              <div className="font-semibold">{product.title}</div>
              <div className="text-sm text-gray-600">{product.category.name}</div>
            </Link>
          ))}
        </div>
      )}

      {/* OR Browse */}
      {isShowBrowser && (
        <div className="text-sm text-gray-600 ">
          <div className="flex items-center space-x-2 mt-5 max-w-[100vw] overflow-x-auto">
            <BigButton disabled={buttonLoading} onClick={handleClickBigButton} text="SELL ITEMS" />
            <span className="text-gray-400">|</span>
            <BigButton disabled={buttonLoading} onClick={handleClickBigButton} text="SELL MACHINES" />
            <span className="text-gray-400">|</span>
            <BigButton disabled={buttonLoading} onClick={handleClickBigButton} text="SELL PARTS" />
          </div>
          {/*  <span className="mr-2 text-gray-500">or browse:</span> */}
          <span className="space-x-2">
            {/* <Link href="/products/machines/laundry" className="text-blue-600 hover:underline font-medium">
              Laundry Machines
            </Link> */}
            {/* <span className="text-gray-400">|</span>
            <Link href="/products/machines/dry-cleaning" className="text-blue-600 hover:underline font-medium">
              Dry Cleaning
            </Link> */}
            {/* <span className="text-gray-400">|</span> */}
            {/* <Link href="/products/machines/finishing" className="text-blue-600 hover:underline font-medium">
              Finishing
            </Link> */}
          </span>
          {openSellerDialog && <SellerFormDialog callback="/admin/addNewProduct" open={openSellerDialog} setOpen={setOpenSellerDialog} />}
          {openDialog && <SellerFormDialog2 callback="/admin/addNewProduct" text="" open={openDialog} setOpen={setOpenDialog}/>}
        </div>
      )}
    </div>
  );
}

