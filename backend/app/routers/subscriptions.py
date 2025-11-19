from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database

router = APIRouter(
    prefix="/subscriptions",
    tags=["subscriptions"]
)

@router.post("/{user_id}", response_model=schemas.Subscription)
def create_subscription(user_id: int, sub: schemas.SubscriptionCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if subscription exists
    if db_user.subscription:
        # Update existing
        db_user.subscription.plan_type = sub.plan_type
        db.commit()
        db.refresh(db_user.subscription)
        return db_user.subscription
    
    new_sub = models.Subscription(user_id=user_id, plan_type=sub.plan_type)
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub
