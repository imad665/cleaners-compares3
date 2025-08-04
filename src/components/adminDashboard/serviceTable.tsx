'use client';

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import ServiceForm from "./serviceEngineer";
import { toast } from "sonner";


function DeleteModal({ setShowDeleteModal, confirmDelete, selectedItem }:
  {
    setShowDeleteModal: (v: boolean) => void,
    confirmDelete: () => void,
    selectedItem: any
  }
) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 md:mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}


interface Service {
  id: string;
  title: string;
  category: {
    name: string;
  };
  ratePerHour: number;
  callOutCharges: number;
  areaOfService: string;
  email: string;
  isFeatured: boolean;
  isEnabled: boolean;
  pictureUrl?: string;
  contactNumber: string;
  address: string;
  companyType: string;
  experience: string;
}

export default function ServiceTable({ newService = null }: { newService?: Service }) {
  const [services, setServices] = useState<Service[]>([]);

  const [editItem, setEditItem] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (newService) setServices((prev) => [...prev, newService]);
  }, [newService])


  const confirmDelete = async () => {
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
      }
      setServices((prev) => prev.filter((s) => s.id !== id));
      const { message } = await res.json();
      toast.success(message || 'the service deleted successfuly');
    } catch (error) {
      toast.error('somthing went wrong');
    } finally {
      setSelectedItem(null);
      setShowDeleteModal(false);

    }
  }

  const handleEdit = (editItem: any) => {
    setIsEdit(true);
    setEditItem(editItem);
  }
  const onSubmitSuccess = (v: any) => {
    setIsEdit(false);
    setEditItem(null);
    const n = [...services.filter((s) => s.id != v.id), v];
    setServices(n)
  }


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/admin/myServices");
        const data = await res.json();
        console.log(data, ';;;;;;;;;;;;;;;');
        setServices(data.services);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (selectItem: Service) => {
    setSelectedItem(selectItem);
    setShowDeleteModal(true);
  };

  return (
    <div className="p-6 w-fit m-aut overflow-auto bg-white rounded-2xl shadow-md ">
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
                    {service.featuredEndDate&&<Badge variant='default' className="bg-green-200 text-black text-xs">featured until:{service.featuredEndDate.split('T')[0]}</Badge> }
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
        <DialogContent className=" min-w-fit">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <ServiceForm onSubmitSuccess={onSubmitSuccess} editItem={editItem} />
        </DialogContent>
      </Dialog>


      {showDeleteModal &&
        <DeleteModal
          setShowDeleteModal={setShowDeleteModal}
          confirmDelete={confirmDelete}
          selectedItem={selectedItem}
        />}
    </div>
  );
}
