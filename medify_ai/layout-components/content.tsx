import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
const Content = () => {
  return(
    <div className="content mt-0 mb-3 mx-auto">
    <Table className=" table-auto w-full mt-0 mb-2 mx-auto">
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Disease</TableHead>
      <TableHead>symptoms</TableHead>
      <TableHead>time created</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
</div>
    
  )
    
  ;
};

export default Content;
