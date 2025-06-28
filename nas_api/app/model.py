# app/model.py
import torch.nn as nn

activation_map = {
    'relu': nn.ReLU,
    'leakyrelu': nn.LeakyReLU
}

best_architecture = {
    'conv_layers': [
        {'filters': 128, 'kernel_size': 2, 'activation': 'relu'},
        {'filters': 32,  'kernel_size': 2, 'activation': 'relu'},
        {'filters': 32,  'kernel_size': 2, 'activation': 'relu'},
        {'filters': 16,  'kernel_size': 2, 'activation': 'leakyrelu'},
        {'filters': 32,  'kernel_size': 2, 'activation': 'leakyrelu'},
        {'filters': 128, 'kernel_size': 5, 'activation': 'leakyrelu'}
    ],
    'fc_layers': [
        {'units': 128, 'activation': 'leakyrelu'},
        {'units': 128, 'activation': 'relu'}
    ],
    'dropout_rate': 0.3
}

class NASModel(nn.Module):
    def __init__(self, architecture, num_classes=4):
        super(NASModel, self).__init__()
        conv_layers = []
        in_channels = 3
        for conv_spec in architecture['conv_layers']:
            out_channels = conv_spec['filters']
            kernel_size = conv_spec['kernel_size']
            activation = activation_map[conv_spec['activation']]()
            conv_layers.append(nn.Conv2d(in_channels, out_channels, kernel_size, padding=kernel_size // 2))
            conv_layers.append(nn.BatchNorm2d(out_channels))
            conv_layers.append(activation)
            conv_layers.append(nn.MaxPool2d(2, 2))
            in_channels = out_channels

        self.conv_part = nn.Sequential(*conv_layers)
        self.global_pool = nn.AdaptiveAvgPool2d(1)

        fc_layers = []
        in_features = architecture['conv_layers'][-1]['filters']
        for fc_spec in architecture['fc_layers']:
            out_features = fc_spec['units']
            activation = activation_map[fc_spec['activation']]()
            fc_layers.append(nn.Linear(in_features, out_features))
            fc_layers.append(activation)
            fc_layers.append(nn.Dropout(architecture['dropout_rate']))
            in_features = out_features

        fc_layers.append(nn.Linear(in_features, num_classes))
        self.fc_part = nn.Sequential(*fc_layers)

    def forward(self, x):
        x = self.conv_part(x)
        x = self.global_pool(x)
        x = x.view(x.size(0), -1)
        x = self.fc_part(x)
        return x
