import SideBar from "@/components/page/sidebar";  

const PageLayout = ({  
  children,  
}: Readonly<{  
  children: React.ReactNode;  
}>) => {  
  return (  
    <div className="flex">  
      <SideBar isGuest={true} />  
      <main className="flex-grow p-5">{children}</main>  
    </div>  
  );  
};  

export default PageLayout;  