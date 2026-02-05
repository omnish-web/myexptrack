/**
 * ========================================
 * EXPENSE TRACKER - BACKEND
 * ========================================
 */

function doGet() {
  // Matches the filename 'Index.html'
  return HtmlService.createTemplateFromFile('Index') 
    .evaluate()
    .setTitle('Expense Command Center')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getInitialData() {
  const response = {
    expenses: [], 
    categories: {}, 
    sources: [], 
    scheduled: [], 
    budgets: {}, 
    pending: [],
    snapshot: null, // NEW: Field for snapshot data
    schema: { id: 0, date: 1, type: 2, sub: 3, parent: 4, amt: 5, mode: 6, source: 7, remarks: 8 }
  };

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tz = Session.getScriptTimeZone();
    
    // --- SETUP SHEETS ---
    let expSheet = ss.getSheetByName('Expenses');
    if (!expSheet) { expSheet = ss.insertSheet('Expenses'); expSheet.appendRow(['Transaction ID', 'Date', 'Type', 'Sub', 'Parent', 'Amount', 'Mode', 'Source', 'Remarks']); }
    
    let catSheet = ss.getSheetByName('Categories');
    if (!catSheet) { catSheet = ss.insertSheet('Categories'); catSheet.appendRow(['Utility', 'Grocery']); }
    
    let srcSheet = ss.getSheetByName('Source');
    if (!srcSheet) { srcSheet = ss.insertSheet('Source'); srcSheet.appendRow(['Source', 'Type', 'Opening', 'Stmt', 'Due', 'Link', 'Fav', 'Def']); }
    
    let recSheet = ss.getSheetByName('Recurring');
    if (!recSheet) { recSheet = ss.insertSheet('Recurring'); recSheet.appendRow(['ID', 'Freq', 'Date', 'End', 'Type', 'Sub', 'Parent', 'Amt', 'Mode', 'Src', 'Rem']); }
    
    let budgetSheet = ss.getSheetByName('Budgets');
    if (!budgetSheet) { budgetSheet = ss.insertSheet('Budgets'); budgetSheet.appendRow(['Category', 'Limit']); }
    
    let pendSheet = ss.getSheetByName('Pending_Transactions');
    if (!pendSheet) {
      pendSheet = ss.insertSheet('Pending_Transactions');
      pendSheet.appendRow(["ID", "Date Created", "Description", "Amount", "Expected Date", "Income Category", "Income SubCategory", "Income Account", "Transfer Account", "Transfer Category", "Transfer SubCategory", "Status"]);
    }

    // NEW: SNAPSHOT SHEET SETUP
    let snapSheet = ss.getSheetByName('Balance_Snapshots');
    if (!snapSheet) { 
        snapSheet = ss.insertSheet('Balance_Snapshots'); 
        snapSheet.appendRow(['Date', 'Balances_JSON', 'Notes']); 
    }

    // --- 1. GET LATEST SNAPSHOT & CUTOFF DATE ---
    const snapLR = snapSheet.getLastRow();
    let cutoffDate = new Date('2000-01-01'); // Default: Load everything if no snapshot
    
    if (snapLR > 1) {
        // Get the very last snapshot
        const lastSnap = snapSheet.getRange(snapLR, 1, 1, 2).getValues()[0];
        if (lastSnap[0]) {
            response.snapshot = {
                date: Utilities.formatDate(new Date(lastSnap[0]), tz, 'yyyy-MM-dd'),
                balances: JSON.parse(lastSnap[1])
            };
            cutoffDate = new Date(lastSnap[0]);
        }
    }

    // --- 2. LOAD EXPENSES (PAGINATED) ---
    const expLR = expSheet.getLastRow();
    if (expLR > 1) {
      // Fetch all data (filtering in memory is faster than multi-calls for typical sheet sizes < 50k rows)
      const rawData = expSheet.getRange(2, 1, expLR - 1, 9).getValues();
      
      response.expenses = rawData.filter(r => {
         if (r[0] === "") return false;
         
         // CRITICAL: Only include rows NEWER than the snapshot
         // (Snapshot includes balances for everything before this date)
         const rowDate = new Date(r[1]);
         return rowDate > cutoffDate; 
      }).map(r => {
        if (r[1] && r[1] instanceof Date) r[1] = Utilities.formatDate(r[1], tz, 'yyyy-MM-dd');
        return r;
      });
    }

    // --- 3. LOAD SCHEDULED ---
    const recLR = recSheet.getLastRow();
    if (recLR > 1) {
      const rawRec = recSheet.getRange(2, 1, recLR - 1, 11).getValues();
      response.scheduled = rawRec.filter(r => r[0] !== "").map(r => {
        if (r[2] && r[2] instanceof Date) r[2] = Utilities.formatDate(r[2], tz, 'yyyy-MM-dd');
        if (r[3] && r[3] instanceof Date) r[3] = Utilities.formatDate(r[3], tz, 'yyyy-MM-dd');
        return r;
      });
    }

    // --- 4. LOAD CATEGORIES ---
    const catLR = catSheet.getLastRow();
    const catLC = catSheet.getLastColumn();
    if (catLR > 0 && catLC > 0) {
      const catValues = catSheet.getRange(1, 1, catLR, catLC).getValues();
      const headers = catValues.shift();
      if (headers) {
        for (let col = 0; col < headers.length; col++) {
          const parent = headers[col];
          if (!parent) continue;
          response.categories[parent] = [];
          for (let row = 0; row < catValues.length; row++) {
            const sub = catValues[row][col];
            if (sub && sub !== "") response.categories[parent].push(String(sub));
          }
        }
      }
    }

    // --- 5. LOAD SOURCES ---
    const srcLR = srcSheet.getLastRow();
    if (srcLR > 1) {
      response.sources = srcSheet.getRange(2, 1, srcLR - 1, 8).getValues().filter(r => r[0] !== "");
    }
    
    // --- 6. LOAD BUDGETS ---
    const budgetLR = budgetSheet.getLastRow();
    if (budgetLR > 1) {
      const budgetData = budgetSheet.getRange(2, 1, budgetLR - 1, 2).getValues();
      budgetData.forEach(row => {
        if (row[0] && row[1]) response.budgets[row[0]] = Number(row[1]);
      });
    }
    
    // --- 7. LOAD PENDING TRANSACTIONS ---
    if (pendSheet) {
      const pData = pendSheet.getDataRange().getValues();
      if (pData.length > 1) {
        response.pending = pData.slice(1).filter(r => r[11] === "Pending").map(r => ({
          id: r[0],
          description: r[2],
          amount: r[3],
          expectedDate: Utilities.formatDate(new Date(r[4]), tz, "yyyy-MM-dd"),
          incomeCategory: r[5],
          incomeSubCategory: r[6],
          incomeAccount: r[7],
          transferAccount: r[8],
          transferCategory: r[9],
          transferSubCategory: r[10]
        }));
      }
    }

    return JSON.stringify(response);

  } catch (e) {
    return JSON.stringify({ error: true, message: "Backend Error: " + e.toString() });
  }
}
// NEW: FETCH HISTORY (For Reports Tab)
function fetchHistory(year) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Expenses');
  const tz = Session.getScriptTimeZone();
  const data = sheet.getDataRange().getValues();
  
  // Filter for specific year (or all older data)
  const results = data.slice(1).filter(r => {
      if(!r[1]) return false;
      const d = new Date(r[1]);
      return d.getFullYear() === parseInt(year);
  }).map(r => {
      if (r[1] instanceof Date) r[1] = Utilities.formatDate(r[1], tz, 'yyyy-MM-dd');
      return r;
  });
  
  return JSON.stringify(results);
}

// NEW: SAVE SNAPSHOT
function saveSnapshot(dateStr, balancesJSON) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Balance_Snapshots');
  if (!sheet) sheet = ss.insertSheet('Balance_Snapshots');
  
  sheet.appendRow([dateStr, balancesJSON, 'User Generated']);
  return "Snapshot Saved";
}
// --- PENDING TRANSACTIONS MODULE ---

function savePendingTransaction(formObject) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Pending_Transactions");
  
  const isEdit = formObject.pendingId && formObject.pendingId !== "";
  const id = isEdit ? formObject.pendingId : "PEND-" + new Date().getTime();
  const timestamp = new Date();
  
  let trfAcct = formObject.transferAccount || "";
  let trfCat = formObject.transferCategory || "";
  let trfSub = formObject.transferSubCategory || "";
  
  if (formObject.transferSplits && formObject.transferSplits !== "[]") {
    trfAcct = formObject.transferSplits; 
    trfCat = "Split";
    trfSub = "Split";
  }

  const rowData = [
    id, timestamp, formObject.description, formObject.amount, formObject.expectedDate,
    formObject.incomeCategory, formObject.incomeSubCategory, formObject.incomeAccount,
    trfAcct, trfCat, trfSub, "Pending"
  ];

  if (isEdit) {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
        return { status: "success", message: "Receivable Updated" };
      }
    }
  } else {
    sheet.appendRow(rowData);
  }
  return { status: "success", message: "Receivable Saved" };
}

function getPendingTransactions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Pending_Transactions");
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  return data.slice(1).filter(r => r[11] === "Pending").map(r => ({
    id: r[0],
    description: r[2],
    amount: r[3],
    expectedDate: Utilities.formatDate(new Date(r[4]), Session.getScriptTimeZone(), "yyyy-MM-dd"),
    incomeCategory: r[5],
    incomeSubCategory: r[6],
    incomeAccount: r[7],
    transferAccount: r[8],
    transferCategory: r[9],
    transferSubCategory: r[10]
  }));
}

function deletePendingTransaction(id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Pending_Transactions");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Deleted successfully" };
    }
  }
  return { status: "error", message: "ID not found" };
}

function approvePendingTransaction(finalData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const txnSheet = ss.getSheetByName("Expenses"); 
  const pendSheet = ss.getSheetByName("Pending_Transactions");
  
  const txnDate = finalData.date ? new Date(finalData.date) : new Date(); 
  const time = new Date().getTime();
  
  // 1. APPEND TRANSACTIONS FIRST (Safe Data)
  try {
    // Log Income
    txnSheet.appendRow([
      "TXN-" + time + "-INC",
      txnDate, "Income", finalData.incomeSubCategory, "Income", finalData.amount,
      "Cashless", finalData.incomeAccount, finalData.description
    ]);
    
    // Log Transfers
    if (finalData.transferAccount && finalData.transferAccount !== "") {
      if (finalData.transferAccount.startsWith("[")) {
        const splits = JSON.parse(finalData.transferAccount);
        splits.forEach((split, index) => {
          const remarkString = `Settlement: ${finalData.description} | To: ${split.acct}: ${split.amount}`;
          txnSheet.appendRow([
            "TXN-" + time + "-TRF" + index,
            txnDate, "Transfer", split.sub, split.parent, split.amount,
            "Cashless", finalData.incomeAccount,
            remarkString
          ]);
        });
      } else {
        const remarkString = `Settlement: ${finalData.description} | To: ${finalData.transferAccount}: ${finalData.amount}`;
        txnSheet.appendRow([
          "TXN-" + time + "-TRF",
          txnDate, "Transfer", finalData.transferSubCategory, finalData.transferCategory,
          finalData.amount, "Cashless", finalData.incomeAccount, 
          remarkString
        ]);
      }
    }
  } catch (e) {
    // If writing to ledger fails, STOP. Do not delete the pending item.
    return { status: "error", message: "Ledger write failed: " + e.toString() };
  }

  // 2. DELETE PENDING ITEM (Cleanup)
  // Only runs if Step 1 succeeded
  const data = pendSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == finalData.id) {
      pendSheet.deleteRow(i + 1);
      break;
    }
  }
  
  return { status: "success", message: "Transaction Approved & Logged" };
}

// --- STANDARD HELPER FUNCTIONS ---

function saveTransaction(f) { 
  try { 
    const ss=SpreadsheetApp.getActiveSpreadsheet(); 
    const es=ss.getSheetByName('Expenses'); 
    const src=f.splits&&f.splits.length>0?f.splits.map(s=>`${s.source}: ${s.amount}`).join(' | '):f.source||""; 
    const id=f.transactionId||"TXN-"+new Date().getTime(); 
    const row=[id,String(f.date),f.type,f.subCategory,f.parentCategory,f.amount,f.mode,src,f.remarks]; 
    if(f.transactionId){ 
      const fin=es.createTextFinder(id).matchEntireCell(true); 
      const r=fin.findNext(); 
      if(r)es.getRange(r.getRow(),1,1,9).setValues([row]); 
      else throw new Error("ID not found"); 
    }else{ 
      es.appendRow(row); 
    } 
    const lastRow=es.getLastRow(); 
    if(lastRow>1)es.getRange(2,1,lastRow-1,9).sort({column:2,ascending:false}); 
    return JSON.stringify({success:true,savedId:id}); 
  } catch(e){ 
    return JSON.stringify({success:false,message:e.toString()}); 
  } 
}

function deleteTransaction(id) { 
  try { 
    const ss=SpreadsheetApp.getActiveSpreadsheet(); 
    const es=ss.getSheetByName('Expenses'); 
    const f=es.createTextFinder(id).matchEntireCell(true); 
    const r=f.findNext(); 
    if(r)es.deleteRow(r.getRow()); 
    return JSON.stringify({success:true}); 
  } catch(e) { 
    return JSON.stringify({success:false,message:e.toString()}); 
  } 
}

function restoreTransaction(txnData) { 
  try { 
    const ss=SpreadsheetApp.getActiveSpreadsheet(); 
    const es=ss.getSheetByName('Expenses'); 
    es.appendRow(txnData); 
    const lastRow=es.getLastRow(); 
    if(lastRow>1)es.getRange(2,1,lastRow-1,9).sort({column:2,ascending:false}); 
    return JSON.stringify({success:true}); 
  } catch(e) { 
    return JSON.stringify({success:false,message:e.toString()}); 
  } 
}

function saveBatchTransactions(p) { 
  try { 
    const ss=SpreadsheetApp.getActiveSpreadsheet(); 
    const es=ss.getSheetByName('Expenses'); 
    const rows=[]; const ids=[]; const t=new Date().getTime(); 
    p.entries.forEach((e,i)=>{ 
      const id="TXN-"+(t+i); ids.push(id); 
      rows.push([id,e.date,e.type,e.subCategory,e.parentCategory,e.amount,e.mode,e.source,e.remarks]); 
    }); 
    if(rows.length>0){ 
      es.getRange(es.getLastRow()+1,1,rows.length,9).setValues(rows); 
      const lastRow=es.getLastRow(); 
      if(lastRow>1)es.getRange(2,1,lastRow-1,9).sort({column:2,ascending:false}); 
    } 
    return JSON.stringify({success:true,savedIds:ids}); 
  } catch(e) { 
    return JSON.stringify({success:false,message:e.toString()}); 
  } 
}

function saveSchedule(f) { 
  try { 
    const ss=SpreadsheetApp.getActiveSpreadsheet(); 
    const rs=ss.getSheetByName('Recurring'); 
    const id=f.scheduleId||"SCH-"+new Date().getTime(); 
    const row=[id,f.frequency,f.startDate,f.endDate,f.type,f.subCategory,f.parentCategory,f.amount,f.mode,f.source,f.remarks]; 
    if(f.scheduleId){ 
      const fin=rs.createTextFinder(id).matchEntireCell(true); 
      const r=fin.findNext(); 
      if(r)rs.getRange(r.getRow(),1,1,11).setValues([row]); 
      else throw new Error("ID not found"); 
    }else{ 
      rs.appendRow(row); 
    } 
    return JSON.stringify({success:true}); 
  } catch(e) { 
    return JSON.stringify({success:false,message:e.toString()}); 
  } 
}

function deleteSchedule(id) { 
  try { 
    const ss=SpreadsheetApp.getActiveSpreadsheet(); 
    const rs=ss.getSheetByName('Recurring'); 
    const f=rs.createTextFinder(id).matchEntireCell(true); 
    const r=f.findNext(); 
    if(r)rs.deleteRow(r.getRow()); 
    return JSON.stringify({success:true}); 
  } catch(e) { 
    return JSON.stringify({success:false,message:e.toString()}); 
  } 
}

function saveBudget(category,limit) { 
  try { 
    const ss=SpreadsheetApp.getActiveSpreadsheet(); 
    let bs=ss.getSheetByName('Budgets'); 
    if(!bs){ bs=ss.insertSheet('Budgets'); bs.appendRow(['Category','Monthly Limit']); } 
    const lr=bs.getLastRow(); let found=false; 
    if(lr>1){ 
      const data=bs.getRange(2,1,lr-1,1).getValues(); 
      for(let i=0;i<data.length;i++){ 
        if(data[i][0]===category){ bs.getRange(i+2,2).setValue(limit); found=true; break; } 
      } 
    } 
    if(!found) bs.appendRow([category,limit]); 
    return JSON.stringify({success:true}); 
  } catch(e) { 
    return JSON.stringify({success:false,message:e.toString()}); 
  } 
}

function deleteBudget(category) { 
  try { 
    const ss=SpreadsheetApp.getActiveSpreadsheet(); 
    const bs=ss.getSheetByName('Budgets'); 
    if(!bs) return JSON.stringify({success:true}); 
    const f=bs.createTextFinder(category).matchEntireCell(true); 
    const r=f.findNext(); 
    if(r) bs.deleteRow(r.getRow()); 
    return JSON.stringify({success:true}); 
  } catch(e) { 
    return JSON.stringify({success:false,message:e.toString()}); 
  } 
}

function updateSourceFlags(sourceName,flagType,value) { 
  try { 
    const ss=SpreadsheetApp.getActiveSpreadsheet(); 
    const s=ss.getSheetByName('Source'); 
    const lr=s.getLastRow(); 
    if(lr<2)return JSON.stringify({success:false,message:"No data"}); 
    const col=flagType==='fav'?7:8; 
    if(flagType==='def'&&value===true){ s.getRange(2,col,lr-1,1).setValues(new Array(lr-1).fill([false])); } 
    const f=s.getRange(2,1,lr-1,1).createTextFinder(sourceName).matchEntireCell(true); 
    const r=f.findNext(); 
    if(r){ s.getRange(r.getRow(),col).setValue(value); return JSON.stringify({success:true}); } 
    return JSON.stringify({success:false,message:"Not found"}); 
  } catch(e){ 
    return JSON.stringify({success:false,message:e.toString()}); 
  } 
}

function manageSettings(action,params) { 
  try { 
    const ss=SpreadsheetApp.getActiveSpreadsheet(); 
    const cat=ss.getSheetByName('Categories'); 
    const src=ss.getSheetByName('Source'); 
    switch(action){ 
      case 'addSource': src.appendRow([params.name,params.type||'Bank',0,'','','',false,false]); break; 
      case 'deleteSource': const sf=src.createTextFinder(params.name).matchEntireCell(true); const sr=sf.findNext(); if(sr)src.deleteRow(sr.getRow()); break; 
      case 'addParent': cat.getRange(1,cat.getLastColumn()+1).setValue(params.name); break; 
      case 'addSub': const h=cat.getDataRange().getValues()[0]; const ci=h.indexOf(params.parent); if(ci>-1){ const d=cat.getRange(1,ci+1,cat.getLastRow(),1).getValues().flat(); let lr=0; for(let i=0;i<d.length;i++)if(d[i]!=="")lr=i; cat.getRange(lr+2,ci+1).setValue(params.sub); } break; 
      case 'deleteSub': const subf=cat.createTextFinder(params.sub).matchEntireCell(true); let subr=subf.findNext(); while(subr){ subr.deleteCells(SpreadsheetApp.Dimension.ROWS); subr=subf.findNext(); } break; 
    } 
    return JSON.stringify({success:true}); 
  } catch(e){ 
    return JSON.stringify({success:false,message:e.toString()}); 
  } 
}

function reclassifySubCategory(sub,oldParent,newParent) { 
  try { 
    const ss=SpreadsheetApp.getActiveSpreadsheet(); 
    const cat=ss.getSheetByName('Categories'); 
    const exp=ss.getSheetByName('Expenses'); 
    const cd=cat.getDataRange().getValues(); 
    const h=cd[0]; 
    const oi=h.indexOf(oldParent); 
    if(oi>-1){ 
      for(let i=1;i<cd.length;i++){ 
        if(cd[i][oi]===sub){ cat.getRange(i+1,oi+1).deleteCells(SpreadsheetApp.Dimension.ROWS); break; } 
      } 
    } 
    let ni=h.indexOf(newParent); 
    if(ni===-1){ ni=h.length; cat.getRange(1,ni+1).setValue(newParent); } 
    const nd=cat.getRange(1,ni+1,cat.getLastRow(),1).getValues().flat(); 
    let ir=nd.length+1; 
    for(let i=1;i<nd.length;i++){ if(nd[i]==="") { ir=i+1; break; } } 
    cat.getRange(ir,ni+1).setValue(sub); 
    const ed=exp.getDataRange().getValues(); 
    for(let i=1;i<ed.length;i++){ if(ed[i][3]===sub) exp.getRange(i+1,5).setValue(newParent); } 
    return JSON.stringify({success:true}); 
  } catch(e){ 
    return JSON.stringify({success:false,message:e.toString()}); 
  } 
}

function renameParentCategory(oldName, newName) { 
  const ss = SpreadsheetApp.getActiveSpreadsheet(); 
  const catSheet = ss.getSheetByName('Categories'); 
  const catData = catSheet.getDataRange().getValues(); 
  for(let i=1; i<catData.length; i++) { 
    if(catData[i][0] === oldName) { catSheet.getRange(i+1, 1).setValue(newName); break; } 
  } 
  const expSheet = ss.getSheetByName('Expenses'); 
  const expData = expSheet.getDataRange().getValues(); 
  let valuesUpdated = false; 
  for(let i=1; i<expData.length; i++) { 
    if(expData[i][4] === oldName) { expData[i][4] = newName; valuesUpdated = true; } 
  } 
  if(valuesUpdated) { 
    expSheet.getRange(1, 1, expData.length, expData[0].length).setValues(expData); 
  } 
}

function deleteParentCategory(name) { 
  const ss = SpreadsheetApp.getActiveSpreadsheet(); 
  const catSheet = ss.getSheetByName('Categories'); 
  const data = catSheet.getDataRange().getValues(); 
  for(let i=1; i<data.length; i++) { 
    if(data[i][0] === name) { catSheet.deleteRow(i+1); break; } 
  } 
}

function processRecurringTransactions() { 
  try { 
    const ss=SpreadsheetApp.getActiveSpreadsheet(); 
    const rs=ss.getSheetByName('Recurring'); 
    const es=ss.getSheetByName('Expenses'); 
    const lr=rs.getLastRow(); 
    if(lr<2)return; 
    const rng=rs.getRange(2,1,lr-1,11); 
    const data=rng.getValues(); 
    const today=new Date(); today.setHours(0,0,0,0); 
    data.forEach((r,i)=>{ 
      let n=new Date(r[2]); n.setHours(0,0,0,0); 
      const end=r[3]?new Date(r[3]):null; 
      if(end)end.setHours(0,0,0,0); 
      if(end&&today>end)return; 
      if(today>=n){ 
        const tid="TXN-AUTO-"+today.getTime()+"-"+i; 
        const ds=Utilities.formatDate(today,ss.getSpreadsheetTimeZone(),"yyyy-MM-dd"); 
        es.appendRow([tid,ds,r[4],r[5],r[6],r[7],r[8],r[9],r[10]+" (Auto)"]); 
        if(r[1]==='One-Time'){ 
          data[i][3]=Utilities.formatDate(new Date(today.getTime()-86400000),ss.getSpreadsheetTimeZone(),"yyyy-MM-dd"); 
        }else{ 
          let nd=new Date(n); 
          switch(r[1]){ 
            case 'Daily':nd.setDate(nd.getDate()+1);break; 
            case 'Weekly':nd.setDate(nd.getDate()+7);break; 
            case 'Monthly':nd.setMonth(nd.getMonth()+1);break; 
            case 'Semi-Annually':nd.setMonth(nd.getMonth()+6);break; 
            case 'Annually':nd.setFullYear(nd.getFullYear()+1);break; 
          } 
          data[i][2]=Utilities.formatDate(nd,ss.getSpreadsheetTimeZone(),"yyyy-MM-dd"); 
        } 
      } 
    }); 
    rng.setValues(data); 
    const elr=es.getLastRow(); 
    if(elr>1)es.getRange(2,1,elr-1,9).sort({column:2,ascending:false}); 
  } catch(e){ 
    Logger.log(e); 
  } 
}

function createDailyTrigger() { 
  const t=ScriptApp.getProjectTriggers(); 
  t.forEach(x=>{ if(x.getHandlerFunction()==='processRecurringTransactions') ScriptApp.deleteTrigger(x); }); 
  ScriptApp.newTrigger('processRecurringTransactions').timeBased().everyDays(1).atHour(1).create(); 
}
function deleteBulkTransactions(ids) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Expenses');
  const data = sheet.getDataRange().getValues();
  
  // We process deletion from bottom to top to preserve indices
  // or easier: just mark rows to delete and delete them in one go if possible,
  // but row deletion is slow. 
  // Faster approach: Filter the array and write back (if dataset isn't huge).
  // Safest approach for IDs:
  
  // 1. Map IDs to Row Numbers (1-based)
  let rowsToDelete = [];
  // Skip header (i=1)
  for (let i = 1; i < data.length; i++) {
    if (ids.includes(data[i][0])) { // Assuming ID is column 0
      rowsToDelete.push(i + 1);
    }
  }
  
  // 2. Delete rows (Reverse order to avoid index shifting)
  rowsToDelete.sort((a, b) => b - a);
  rowsToDelete.forEach(row => {
    sheet.deleteRow(row);
  });
  
  return "Success";
}

function updateBulkCategory(ids, newParent, newSub) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Expenses');
  const data = sheet.getDataRange().getValues();
  
  // Columns indices (0-based)
  const COL_ID = 0;
  const COL_SUB = 3;    // Check your schema: usually Sub-Category is col 3
  const COL_PARENT = 4; // Check your schema: usually Parent is col 4
  
  for (let i = 1; i < data.length; i++) {
    if (ids.includes(data[i][COL_ID])) {
      // Direct cell update is slow. Better to update array and write back batch if many.
      // But for bulk edit (usually < 20 items), direct setValue is acceptable, 
      // or setValues for ranges. Let's do row-by-row for safety.
      sheet.getRange(i + 1, COL_SUB + 1).setValue(newSub);
      sheet.getRange(i + 1, COL_PARENT + 1).setValue(newParent);
    }
  }
  
  return "Success";
}

