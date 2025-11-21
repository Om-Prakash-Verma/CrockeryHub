'use client';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import type { ContactFormSubmission } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { toast } from '@/hooks/use-toast';


function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="text-base text-foreground">{value}</p>
    </div>
  );
}

function SubmissionDetails({
  submission,
}: {
  submission: ContactFormSubmission;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <DetailItem label="Name" value={submission.name} />
        <DetailItem label="Email" value={submission.email} />
        {submission.phone && <DetailItem label="Phone" value={submission.phone} />}
        <DetailItem
          label="Date"
          value={format(new Date(submission.submissionDate), 'PPP p')}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <DetailItem label="Subject" value={submission.subject} />
        <DetailItem label="Message" value={submission.message} />
      </div>

      {submission.customFields &&
        Object.keys(submission.customFields).length > 0 && (
          <>
            <Separator />
            <div>
                <h3 className="mb-4 text-sm font-medium uppercase text-muted-foreground">Additional Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {Object.entries(submission.customFields).map(
                    ([key, value]) => (
                        <DetailItem 
                            key={key} 
                            label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                            value={String(value)} 
                        />
                    )
                    )}
                </div>
            </div>
          </>
        )}
    </div>
  );
}


export default function AdminSubmissionsPage() {
  const firestore = useFirestore();
  const submissionsCollection = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'contact_form_submissions'),
            orderBy('submissionDate', 'desc')
          )
        : null,
    [firestore]
  );
  const { data: submissions, isLoading } =
    useCollection<ContactFormSubmission>(submissionsCollection);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactFormSubmission | null>(null);
    
  const handleDeleteSubmission = () => {
    if (selectedSubmission && firestore) {
      const submissionDoc = doc(firestore, 'contact_form_submissions', selectedSubmission.id);
      deleteDocumentNonBlocking(submissionDoc);
      toast({
        title: 'Submission Deletion Initiated',
        description: `Submission from "${selectedSubmission.name}" is being removed.`,
      });
    }
    setDeleteAlertOpen(false);
    setSelectedSubmission(null);
  };
  
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-headline font-bold text-primary">
          Submissions
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Form Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-36" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              {submissions?.map((submission: ContactFormSubmission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    {format(new Date(submission.submissionDate), 'PP')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {submission.name}
                  </TableCell>
                   <TableCell className="text-muted-foreground">
                    {submission.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{submission.subject}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={handleActionClick}>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedSubmission(submission);
                              setDialogOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedSubmission(submission);
                              setDeleteAlertOpen(true);
                            }}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {selectedSubmission && selectedSubmission.id === submission.id && (
                        <DialogContent className="sm:max-w-xl">
                          <DialogHeader>
                            <DialogTitle>Submission Details</DialogTitle>
                            <DialogDescription>
                              From {selectedSubmission.name} on{' '}
                              {format(new Date(selectedSubmission.submissionDate), 'PPP')}
                            </DialogDescription>
                          </DialogHeader>
                          <SubmissionDetails submission={selectedSubmission} />
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isLoading && submissions?.length === 0 && (
            <div className="text-center text-muted-foreground p-4">
              No submissions found.
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the submission from &quot;{selectedSubmission?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedSubmission(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubmission}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
