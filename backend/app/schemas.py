from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None

class TodoRead(TodoBase):
    id: int
    completed: bool

    class Config:
        orm_mode = True
