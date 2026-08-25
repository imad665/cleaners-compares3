'use client';

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "@/components/ui/button";
import ButtonDashboard from '@/components/adminDashboard/shared/Button';
import { Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ServiceEngineerForm } from "./serviceEngineer";
import { useAdminServices, Service } from "@/hooks/useAdminServices";
import { toast } from "sonner";
import { AlertDialog } from "../ui/alert-dialog";
import {

  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function DeleteModal({ setShowDeleteModal, confirmDelete, showDeleteModal, selectedItem, isDeleting }:
  {
    setShowDeleteModal: (v: boolean) => void,
    confirmDelete: () => void,
    selectedItem: any,
    showDeleteModal: boolean,
    isDeleting: boolean
  }
) {
  return (
    <AlertDialog open={showDeleteModal} onOpenChange={(open) => {
      if (!isDeleting) {
        setShowDeleteModal(open);
      }
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold text-foreground">"{selectedItem?.title}"</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <ButtonDashboard
            onClick={confirmDelete}
            variant='danger'
            loading={isDeleting}
          >
            Delete
          </ButtonDashboard>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


export default function ServiceTable() {
  const { services, isLoading: loading, mutate } = useAdminServices();

  const [editItem, setEditItem] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const id = selectedItem?.id;
      const res = await fetch('/api/admin/myServices', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error || 'failed to delete service');
      } else {
        mutate(); // Revalidate
        const { message } = await res.json();
        toast.success(message || 'the service deleted successfuly');
        setShowDeleteModal(false);
        setSelectedItem(null);
      }
    } catch (error) {
      toast.error('somthing went wrong');
    } finally {
      setIsDeleting(false);
    }
  }

  const handleEdit = (editItem: any) => {
    setIsEdit(true);
    setEditItem(editItem);
  }
  const onSubmitSuccess = (v: any) => {
    setIsEdit(false);
    setEditItem(null);
    mutate(); // Revalidate
  }


  const handleDelete = async (selectItem: Service) => {
    setSelectedItem(selectItem);
    setShowDeleteModal(true);
    setIsDeleting(false);
  };

  return (
    <div className="p-6 w-fit m-auto w-full overflow-auto bg-white rounded-2xl shadow-md ">
      <h2 className="text-xl font-semibold mb-4">Submitted Services</h2>
      <ScrollArea className="rounded-md border h-[500px]">
        {loading ? <div className="flex justify-center mt-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div> :

          <Table >
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody >
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="font-semibold">{service.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.category?.name} • {service.experience}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>£{service.ratePerHour}/hr</div>
                    <div className="text-sm text-muted-foreground">
                      Call Out: £{service.callOutCharges}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{service.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.contactNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{service.areaOfService}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col justify-center items-center gap-2">
                      <Badge variant="secondary">
                        {service.companyType}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{service?.category}</p>
                    </div>

                  </TableCell>
                  <TableCell className="space-y-1">
                    <Badge className={service.isFeatured ? "bg-green-100" : ""} variant={service.isFeatured ? "secondary" : "outline"}>
                      {service.isFeatured ? "Featured" : "Not Featured"}
                    </Badge>

                    <br />
                    {service.featuredEndDate && <Badge variant='default' className="bg-green-200 text-black text-xs">featured until:{service.featuredEndDate.split('T')[0]}</Badge>}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(service)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(service)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No services found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        }
      </ScrollArea>

      {/* edit dialogue */}
      <Dialog open={isEdit} onOpenChange={setIsEdit}>
        <DialogTrigger asChild>

        </DialogTrigger>
        <DialogContent className=" min-w-fit  h-[85vh] overflow-hidden p-0">
          <DialogHeader className="bg-navy p-6 text-white relative overflow-hidden">
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto min-h-full h-full p-5">
            <ServiceEngineerForm
              onSubmitSuccess={onSubmitSuccess}
              editItem={editItem}
              onCancel={() => setIsEdit(false)}
            />
          </div>

        </DialogContent>
      </Dialog>


      {showDeleteModal &&
        <DeleteModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          confirmDelete={confirmDelete}
          selectedItem={selectedItem}
          isDeleting={isDeleting}
        />}
    </div>
  );
}
