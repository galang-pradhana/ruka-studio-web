"use server";

import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const activeProjects = await prisma.project.count({
      where: { status: "ACTIVE" },
    });

    const totalProjects = await prisma.project.count();

    // Calculate Incomes from Terms (PAID) and Extra Incomes
    const paidTerms = await prisma.projectTerm.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    });

    const extraIncomes = await prisma.projectIncome.aggregate({
      _sum: { amount: true },
    });

    // Total income is Terms PAID + Extra incomes
    const totalIncome = 
      Number(paidTerms._sum.amount || 0) + 
      Number(extraIncomes._sum.amount || 0);

    // Calculate Expenses
    const expenses = await prisma.projectExpense.aggregate({
      _sum: { amount: true },
    });
    
    const totalExpense = Number(expenses._sum.amount || 0);

    // Calculate Net Profit
    const netProfit = totalIncome - totalExpense;

    return {
      data: {
        activeProjects,
        totalProjects,
        totalIncome,
        totalExpense,
        netProfit,
      }
    };
  } catch (error: any) {
    return { error: "Gagal memuat statistik dashboard" };
  }
}
