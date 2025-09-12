
"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/datepicker";
import { Combobox } from "@/components/ui/combobox";
import { AssetFormSchema, AssetFormValues } from "@/lib/types";
import { APP_CONFIG } from "@/lib/config";
import { manufacturerCatalog } from "@/lib/catalog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/components/user-provider";
import { ClipboardCopy, FileJson, RotateCcw } from "lucide-react";
import { Label } from "./ui/label";

interface AddAssetDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAssetAdded: () => void;
}

function JsonImportDialog({
  isOpen,
  onOpenChange,
  onImport,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImport: (data: any) => void;
}) {
  const { toast } = useToast();
  const [jsonString, setJsonString] = useState("");

  const handleImport = () => {
    try {
      if (!jsonString.trim()) {
        throw new Error("JSON input cannot be empty.");
      }
      const data = JSON.parse(jsonString);
      onImport(data);
      onOpenChange(false);
      setJsonString("");
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      const errorMessage = error instanceof Error ? error.message : "Invalid JSON format.";
      toast({
        variant: "destructive",
        title: "JSON Import Error",
        description: errorMessage,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import from JSON</DialogTitle>
          <DialogDescription>
            Paste the JSON output from your command into the text area below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="json-import-textarea">JSON Data</Label>
            <Textarea
              id="json-import-textarea"
              placeholder='{ "Machine Name": "PC-1234", ... }'
              value={jsonString}
              onChange={(e) => setJsonString(e.target.value)}
              className="h-48 resize-y"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleImport}>Import</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CommandDisplayDialog({
  isOpen,
  onOpenChange,
  command
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  command: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy Information Script</DialogTitle>
          <DialogDescription>
            Highlight the command below and copy it. Then paste it into the Command Prompt on the target machine.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            readOnly 
            value={command} 
            className="font-mono"
            onFocus={(e) => e.target.select()}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function AddAssetDialog({ isOpen, onOpenChange, onAssetAdded }: AddAssetDialogProps) {
  const { toast } = useToast();
  const { currentUser } = useUser();
  const [isJsonImportOpen, setIsJsonImportOpen] = useState(false);
  const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);
  const infoScriptCommand = "\\\\ga-fs5\\home$\\scripts\\json_bat\\system-info.bat";
  const [suggestion, setSuggestion] = useState('');
  const modelInputRef = useRef<HTMLInputElement>(null);


  const form = useForm<AssetFormValues>({
    resolver: zodResolver(AssetFormSchema),
    defaultValues: {
      machineName: "",
      category: "laptops",
      os: "",
      location: "Schaumburg IL",
      manufacturer: "",
      partNumber: "",
      modelNumber: "",
      serialNumber: "",
      type: undefined,
      assignedUser: "",
      userId: undefined,
      userType: "local",
      owner: "Group Administrators",
      status: "In Use",
      notes: "",
      purchaseDate: undefined,
      warrantyExpirationDate: undefined
    },
  });

  const category = form.watch("category");
  const modelNumber = form.watch("modelNumber");

  const findSuggestion = (value: string) => {
    if (!value) {
      setSuggestion('');
      return;
    }
    const lowerValue = value.toLowerCase();
    for (const manufacturer in manufacturerCatalog) {
      for (const category in manufacturerCatalog[manufacturer as keyof typeof manufacturerCatalog]) {
        const categoryData = manufacturerCatalog[manufacturer as keyof typeof manufacturerCatalog][category as keyof typeof manufacturerCatalog[keyof typeof manufacturerCatalog]];
        if (categoryData && categoryData.keywords) {
          for (const keyword of categoryData.keywords) {
            if (keyword.toLowerCase().startsWith(lowerValue)) {
              setSuggestion(keyword);
              return;
            }
          }
        }
      }
    }
    setSuggestion('');
  };

  const autoCategorizeByModel = useCallback((model: string) => {
    if (!model) return;
    const lowerModel = model.toLowerCase();
  
    for (const manufacturer of Object.keys(manufacturerCatalog)) {
      const categoriesData = manufacturerCatalog[manufacturer as keyof typeof manufacturerCatalog];
      for (const category in categoriesData) {
        const catData = categoriesData[category as keyof typeof categoriesData];
        if (catData?.keywords.some(k => lowerModel.includes(k.toLowerCase()))) {
          form.setValue('manufacturer', manufacturer, { shouldValidate: true });
          form.setValue('category', category as AssetFormValues['category'], { shouldValidate: true });
          
          if ((category === 'systems' || category === 'servers') && catData.types) {
            for (const type in catData.types) {
              if (catData.types[type].some(t => lowerModel.includes(t.toLowerCase()))) {
                form.setValue('type', type, { shouldValidate: true });
                break;
              }
            }
          }
          return;
        }
      }
    }
  }, [form]);

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('modelNumber', value, { shouldValidate: true });
    findSuggestion(value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      form.setValue('modelNumber', suggestion, { shouldValidate: true });
      setSuggestion('');
    }
  };

  useEffect(() => {
    if (modelNumber) {
      autoCategorizeByModel(modelNumber);
    }
  }, [modelNumber, autoCategorizeByModel]);

  
  const handleJsonImport = (data: any) => {
    const mapping: Record<string, keyof AssetFormValues> = {
      "Assigned User": "assignedUser",
      "Machine Name": "machineName",
      "Manufacturer": "manufacturer",
      "Model Number": "modelNumber",
      "Serial Number": "serialNumber",
      "OS": "os",
    };

    let fieldsUpdated = false;
    let isDell = false;
    let importedModelNumber = '';

    for (const key in data) {
      const formField = mapping[key];
      if (formField) {
        const value = String(data[key]);
        form.setValue(formField, value, { shouldValidate: true });
        
        if (formField === 'manufacturer' && value.toLowerCase().includes('dell')) {
          isDell = true;
        }
        if (formField === 'modelNumber') {
          importedModelNumber = value;
        }
        fieldsUpdated = true;
      }
    }
    
    if (importedModelNumber) {
      autoCategorizeByModel(importedModelNumber);
    }

    if (isDell && importedModelNumber) {
      form.setValue('partNumber', importedModelNumber, { shouldValidate: true });
    }

    if (fieldsUpdated) {
        toast({
            title: "Import Successful",
            description: "Asset details have been imported into the form."
        });
    } else {
        toast({
            variant: "destructive",
            title: "Import Failed",
            description: "No matching fields were found in the provided JSON."
        });
    }
  };


  const onSubmit = useCallback(async (data: AssetFormValues) => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a user before adding an asset.",
      });
      return;
    }

    const dataToSend = {
      ...data,
      purchaseDate: data.purchaseDate || null,
      warrantyExpirationDate: data.warrantyExpirationDate || null,
      type: data.type || null,
      createdBy: currentUser,
      updatedBy: currentUser,
    };
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to add asset');
      }

      toast({
        title: "Asset Added",
        description: `${data.machineName} has been added to the inventory.`,
      });
      form.reset();
      onAssetAdded(); // Refetch assets
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add asset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add the asset.",
      });
    }
  }, [onAssetAdded, form, onOpenChange, toast, currentUser]);

  const displaySuggestion = suggestion && modelNumber && suggestion.toLowerCase().startsWith(modelNumber.toLowerCase())
    ? modelNumber + suggestion.substring(modelNumber.length)
    : '';

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
      }
      onOpenChange(open);
    }}>
      <DialogContent 
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new asset to the inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsJsonImportOpen(true)} className="shadow-sm">
              <FileJson className="mr-2 h-4 w-4" />
              Import from JSON
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCommandDialogOpen(true)} className="shadow-sm">
              <ClipboardCopy className="mr-2 h-4 w-4" />
              Copy Info Script
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={() => form.reset()} className="ml-auto shadow-sm">
                <RotateCcw className="mr-2 h-4 w-4" />
                Clear Form
            </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{APP_CONFIG.labels.owner}</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="machineName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.machineName}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., WKSTN-DEV-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.category}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APP_CONFIG.categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.manufacturer}</FormLabel>
                    <Combobox
                      options={APP_CONFIG.manufacturers.map(m => ({ value: m, label: m }))}
                      value={field.value}
                      onChange={(value) => form.setValue('manufacturer', value || '', { shouldValidate: true })}
                      placeholder="Select or type manufacturer..."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.location}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APP_CONFIG.locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.modelNumber}</FormLabel>
                    <div className="relative">
                      <Input
                        placeholder="e.g., Latitude 5420"
                        {...field}
                        onChange={handleModelChange}
                        onKeyDown={handleKeyDown}
                        ref={modelInputRef}
                        autoComplete="off"
                      />
                      {displaySuggestion && (
                         <div className="absolute inset-y-0 left-0 px-3 py-2 text-muted-foreground pointer-events-none">
                           <span className="invisible">{field.value}</span>
                           <span>{displaySuggestion.substring(field.value?.length || 0)}</span>
                         </div>
                       )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.partNumber}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., HJVX6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.serialNumber}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5J2X1Y2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="os"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.os}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Windows 11 Pro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(category === 'systems' || category === 'servers') && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{APP_CONFIG.labels.type}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select a ${category.slice(0, -1)} type`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(category === 'systems' ? APP_CONFIG.systemTypes : APP_CONFIG.serverTypes).map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.status}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APP_CONFIG.statuses.map((status) => (
                          <SelectItem key={status.name} value={status.name}>{status.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4 border rounded-lg">
              <div className="md:col-span-2">
                <p className="font-medium text-sm text-foreground mb-3">User Assignment</p>
              </div>
              <FormField
                control={form.control}
                name="assignedUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.assignedUser}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.userId}</FormLabel>
                    <FormControl>
                      <Input type="text" inputMode="numeric" placeholder="e.g., 12345" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem className="space-y-3 pt-2">
                      <FormLabel>{APP_CONFIG.labels.userType}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="local" />
                            </FormControl>
                            <FormLabel className="font-normal">Local</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="remote" />
                            </FormControl>
                            <FormLabel className="font-normal">Remote</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{APP_CONFIG.labels.purchaseDate}</FormLabel>
                    <DatePicker date={field.value ?? undefined} setDate={(d) => field.onChange(d ?? undefined)} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyExpirationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{APP_CONFIG.labels.warrantyExpirationDate}</FormLabel>
                    <DatePicker date={field.value ?? undefined} setDate={(d) => field.onChange(d ?? undefined)} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{APP_CONFIG.labels.notes}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Purchased from Dell Outlet. Has a scratch on the top case. Comes with a 24-inch Dell UltraSharp monitor."
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 flex-row justify-end items-center gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Asset</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
     <JsonImportDialog
        isOpen={isJsonImportOpen}
        onOpenChange={setIsJsonImportOpen}
        onImport={handleJsonImport}
      />
    <CommandDisplayDialog
        isOpen={isCommandDialogOpen}
        onOpenChange={setIsCommandDialogOpen}
        command={infoScriptCommand}
    />
    </>
  );
}
