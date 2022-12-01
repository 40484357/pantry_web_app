from . import db
from flask_login import UserMixin
from datetime import datetime, date


class food_items(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    food_title = db.Column(db.String(1000))
    amount = db.Column(db.String(1000))
    expiry = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    unit = db.Column(db.String(100))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    food_items = db.relationship('food_items')
    shopping_list = db.relationship('shopping_list')
    favourite_recipes = db.relationship('favourite_recipes')
    
class shopping_list(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String (150))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class favourite_recipes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))