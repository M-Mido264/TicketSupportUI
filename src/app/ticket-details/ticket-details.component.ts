import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditLogs } from '../models/LogsAudit';
import { Ticket } from '../models/Ticket';
import { User } from '../models/User';
import { AuditRepository } from '../repos/AuditRepo';
import { TicketRepo } from '../repos/TicketRepo';
import { UserRepository } from '../repos/UserRepository';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css'],
  providers:[UserRepository,TicketRepo,AuditRepository]
})
export class TicketDetailsComponent implements OnInit {
  Users:User[]=[]
  Ticket:Ticket = new Ticket();
  submitted:Boolean
  InProgress:Boolean
  @ViewChild("Form", { static: false })
  Form: NgForm;
  TicketLogs:AuditLogs[]=[];
  LogProgress:Boolean;
  constructor(private userRepo:UserRepository,private ticketRepo:TicketRepo,
    private route:ActivatedRoute,private router:Router,private auditRepo:AuditRepository) { }

  ngOnInit(): void {
    this.route.url.subscribe(url=>{
      this.getData();
    })
  }

  getData(){
    this.userRepo.getAll().subscribe(res=>{
      this.Users = res;
    })
    this.ticketRepo.get(this.route.snapshot.params.id).subscribe(res=>{
         this.Ticket = res;
    });
  }

  save(){
    this.submitted = true;
      if(this.Form.invalid){
        return;
      }     
      this.InProgress = true;
      this.ticketRepo.update(this.Ticket).subscribe(res=>{
         this.reset();
      },err=>{
          this.InProgress = false;
      })
  }

  reset(){
    this.router.navigate(['/home']);
    this.submitted = false;
    this.InProgress = false;
  }

  Logs(){
    this.LogProgress = true;
    this.auditRepo.getAllById("AllLogs",this.Ticket.Id).subscribe(res=>{
      this.TicketLogs = res;
      this.LogProgress = false;
      console.log("🚀 ~ file: ticket-details.component.ts ~ line 65 ~ TicketDetailsComponent ~ this.auditRepo.getAllById ~ this.TicketLogs", this.TicketLogs)
    },err=>{
      this.LogProgress = false;
    console.log("🚀 ~ file: ticket-details.component.ts ~ line 67 ~ TicketDetailsComponent ~ this.auditRepo.getAllById ~ err", err)
    })
  }

  getUserName(userID){
    if(this.Users.length > 0){
      const user = this.Users.find(x=>x.Id == userID);
      return user? user.Name : "";
    }
  }

}
