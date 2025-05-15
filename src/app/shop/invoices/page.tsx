"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  CreditCard,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Printer,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import Navbar from "@/app/components/navbar";

// Types
interface Invoice {
  id: string;
  paymentId: string;
  invoice_number: string;
  date: string;
  amount: number;
  costumer_Email: string;
  items: {
    id: number;
    title: string;
    quantity: number;
    price: number;
  }[];
  user: {
    name: string;
    customerEmail: string;
    address: string;
    phone: string;
  };
  paymentDate?: string;
  downloadUrl: string;
}

interface Payment {
  id: number;
  payment_id: string;
  cart_id: string;
  amount: number;
  payment_status: string;
  payment_proof_url: string;
  created_at: string;
}

const statusMap = {
  0: "pending",
  1: "approved",
  2: "rejected",
} as const;

// Mock data for invoices

export default function Invoices() {
  // State for invoices
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/login");
    }
  }, [router]);

  const [realInvoices, setRealInvoices] = useState<Invoice[]>([]);

  const fetchInvoiceByPaymentId = async (paymentId: number) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/getUserInvoices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            paymentId,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      const formattedInvoices: Invoice[] = data.map(
        (invoice: Omit<Invoice, "items"> & { items: Invoice["items"] }) => ({
          id: invoice.id,
          paymentId: invoice.paymentId,
          invoice_Number: invoice.invoice_number,
          date: invoice.date,
          amount: invoice.amount,
          items: invoice.items,
          user: {
            name: invoice.user.name,
            adress: invoice.user.address,
            phone: invoice.user.phone,
            customerEmail: invoice.user.customerEmail,
          },
          paymentDate: invoice.paymentDate,
          downloadUrl: invoice.downloadUrl || "#",
        })
      );
      console.log(formattedInvoices);

      setRealInvoices(() => formattedInvoices);
      console.log(formattedInvoices);
    } catch (error) {
      console.error("Error fetching invoice by payment ID:", error);
    }
  };

  const [payments, setPayments] = useState<Payment[]>([]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return;
    const fecthPayments = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getUserPayments/${user.id}`
        );
        const data = await response.json();
        console.log(data);
        const formattedPayments: Payment[] = data.map(
          (payment: {
            id: number;
            payment_id: number;
            cart_id: string;
            amount: number;
            payment_status: number;
            payment_proof_url: string;
            created_at: string;
          }) => ({
            id: payment.id,
            payment_id: payment.payment_id,
            cart_id: payment.cart_id,
            amount: payment.amount,
            payment_status:
              statusMap[payment.payment_status as 0 | 1 | 2] || "pending",
            payment_proof_url: payment.payment_proof_url,
            created_at: payment.created_at,
          })
        );
        setPayments(formattedPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fecthPayments();
  }, []);

  // State for detailed view
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);

  // View invoice details
  const viewInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailView(true);
  };

  // Back to invoice list
  const backToInvoiceList = () => {
    setSelectedInvoice(null);
    setShowDetailView(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get status badge
  const getStatusBadge = (status: Payment["payment_status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
    }
  };

  // Print invoice
  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-marfil-suave">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Page header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gris-oscuro">
                  Mis Facturas
                </h1>
                <p className="text-gris-medio mt-1">
                  Aquí puedes observar y descargar todas tu facturas
                </p>
              </div>
            </div>
          </div>

          {/* User navigation */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b border-gris-medio/20">
              <nav className="flex space-x-4">
                <Link
                  href="/"
                  className="text-gris-medio hover:text-dorado-elegante px-3 py-2 text-sm font-medium rounded-md"
                >
                  Panel Principal
                </Link>
                <Link
                  href="/carrito"
                  className="text-gris-medio hover:text-dorado-elegante px-3 py-2 text-sm font-medium rounded-md"
                >
                  <ShoppingBag className="w-4 h-4 inline-block mr-1" />
                  Carrito
                </Link>
                <Link
                  href="/shop/invoices"
                  className="bg-marfil-suave text-dorado-elegante px-3 py-2 text-sm font-medium rounded-md"
                >
                  <FileText className="w-4 h-4 inline-block mr-1" />
                  Facturas
                </Link>
              </nav>
            </div>
          </div>

          {/* Invoice list view */}
          {!showDetailView ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Filters */}
              <div className="p-4 border-b border-gris-medio/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar Facturas ..."
                      className="pl-10 pr-4 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante w-full md:w-64"
                    />
                  </div>

                  {/* Status filter */}
                  <div className="relative">
                    <select className="pl-10 pr-4 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante appearance-none w-full md:w-48">
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gris-medio" />
                  </div>
                </div>
              </div>

              {/* Invoices table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-marfil-suave">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gris-medio/20">
                    {payments.length > 0 ? (
                      payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="hover:bg-marfil-suave/50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-dorado-elegante mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gris-oscuro">
                                  INV-{payment.payment_id}
                                </div>
                                <div className="text-xs text-gris-medio">
                                  Order: {payment.cart_id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gris-medio">
                              {formatDate(payment.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gris-oscuro">
                              ${payment.amount}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(
                              payment.payment_status as Payment["payment_status"]
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {payment.payment_status === "approved" ? (
                              <button
                                onClick={() => {
                                  fetchInvoiceByPaymentId(
                                    parseInt(payment.payment_id)
                                  );
                                  if (realInvoices.length > 0) {
                                    viewInvoiceDetails(realInvoices[0]);
                                  }
                                }}
                                className="text-dorado-elegante hover:text-oro-claro mr-3"
                                title="Ver factura"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                            ) : (
                              <button
                                className="text-gris-medio cursor-not-allowed mr-3"
                                title="Factura no disponible"
                              >
                                <EyeOff className="h-5 w-5" />
                              </button>
                            )}

                            <a
                              href={`http://localhost:3001${payment.payment_proof_url}`}
                              className="text-azul-noche hover:text-dorado-elegante"
                              title="Ver comprobante"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <CreditCard className="h-5 w-5" />
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-gris-medio"
                        >
                          No invoices found. Try adjusting your search or
                          filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Invoice detail view */
            selectedInvoice && (
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden"
                id="invoice-detail"
              >
                {/* Detail header */}
                <div className="p-4 border-b border-gris-medio/20 flex justify-between items-center">
                  <button
                    onClick={backToInvoiceList}
                    className="inline-flex items-center text-gris-oscuro hover:text-dorado-elegante"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Invoices
                  </button>
                  <div className="flex space-x-3">
                    <button
                      onClick={printInvoice}
                      className="inline-flex items-center px-3 py-1.5 border border-gris-medio/30 rounded-md text-sm text-gris-oscuro hover:bg-marfil-suave"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </button>
                    <a
                      href={`http://localhost:3001/invoices/invoice-${realInvoices[0].paymentId}.pdf`}
                      download
                      className="inline-flex items-center px-3 py-1.5 bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro rounded-md text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </div>
                </div>

                {/* Invoice content */}
                <div className="p-6">
                  {/* Invoice header */}
                  <div className="flex flex-col md:flex-row justify-between mb-8">
                    <div>
                      <div className="text-2xl font-bold text-dorado-elegante mb-1">
                        El Rincon Dorado
                      </div>
                      <div className="text-gris-medio text-sm">
                        David, Chiriqui
                      </div>
                      <div className="text-gris-medio text-sm">
                        elricon@doradostore.com
                      </div>
                      <div className="text-gris-medio text-sm">
                        +507 6893-4567
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <div className="text-xl font-bold text-gris-oscuro">
                        {realInvoices[0].id}
                      </div>
                      <div className="text-gris-medio text-sm mt-1">
                        Order: {realInvoices[0].paymentId}
                      </div>
                      <div className="text-gris-medio text-sm">
                        Date: {formatDate(realInvoices[0].date)}
                      </div>
                    </div>
                  </div>

                  {/* Customer info */}
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gris-medio uppercase mb-2">
                      Bill To:
                    </h3>
                    <div className="text-gris-oscuro">
                      {realInvoices[0].user.name}
                    </div>
                    <div className="text-gris-medio text-sm">
                      {realInvoices[0].user.address}
                    </div>
                    <div className="text-gris-medio text-sm">
                      {realInvoices[0].costumer_Email}
                    </div>
                  </div>

                  {/* Invoice items */}
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gris-medio uppercase mb-4">
                      Invoice Items
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gris-medio/20 border border-gris-medio/20 rounded-md">
                        <thead>
                          <tr className="bg-marfil-suave">
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gris-oscuro uppercase"
                            >
                              Item
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-center text-xs font-medium text-gris-oscuro uppercase"
                            >
                              Quantity
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-medium text-gris-oscuro uppercase"
                            >
                              Price
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-medium text-gris-oscuro uppercase"
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gris-medio/20">
                          {realInvoices[0].items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 text-sm text-gris-oscuro">
                                {item.title}
                              </td>
                              <td className="px-4 py-3 text-sm text-gris-medio text-center">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 text-sm text-gris-medio text-right">
                                ${item.price}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gris-oscuro text-right">
                                ${item.quantity * item.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-marfil-suave">
                            <td
                              colSpan={3}
                              className="px-4 py-3 text-sm font-medium text-gris-oscuro text-right"
                            >
                              Subtotal:
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gris-oscuro text-right">
                              ${realInvoices[0].amount}
                            </td>
                          </tr>
                          <tr className="bg-marfil-suave">
                            <td
                              colSpan={3}
                              className="px-4 py-3 text-sm font-medium text-gris-oscuro text-right"
                            >
                              Tax (0%):
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gris-oscuro text-right">
                              $0.00
                            </td>
                          </tr>
                          <tr className="bg-marfil-suave">
                            <td
                              colSpan={3}
                              className="px-4 py-3 text-sm font-bold text-gris-oscuro text-right"
                            >
                              Total:
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-gris-oscuro text-right">
                              ${realInvoices[0].amount}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Payment information */}
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gris-medio uppercase mb-2">
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        {selectedInvoice.paymentDate && (
                          <div className="text-sm text-gris-oscuro">
                            <span className="font-medium">Payment Date:</span>{" "}
                            {formatDate(realInvoices[0].paymentDate ?? "")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes and terms */}
                  <div className="border-t border-gris-medio/20 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gris-medio uppercase mb-2">
                          Notes
                        </h3>
                        <p className="text-sm text-gris-oscuro">
                          Thank you for your purchase! If you have any questions
                          about this invoice, please contact our customer
                          service.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gris-medio uppercase mb-2">
                          Terms & Conditions
                        </h3>
                        <p className="text-sm text-gris-oscuro">
                          Payment is due within 15 days. Please make checks
                          payable to ShopCart or use the bank account
                          information provided.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
